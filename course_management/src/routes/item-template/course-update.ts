// Modified course-update.ts

import express, { Request, Response } from 'express';
import { Op } from 'sequelize';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import { ItemTemplate } from '../../models/item-template';
import { CourseItemTemplate } from '../../models/course-item-template';
import {
  ResourcePrefix,
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from '@datn242/questify-common';
import { CourseItemTemplateCreatedPublisher } from '../../events/publishers/course-item-template-created-publisher';
import { CourseItemTemplateUpdatedPublisher } from '../../events/publishers/course-item-template-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.put(
  ResourcePrefix.CourseManagement + '/:course_id/item-templates',
  requireAuth,
  [body('itemTemplateIds').isArray().withMessage('Item template ids must be an array')],
  validateRequest,
  async (req: Request, res: Response) => {
    const courseId = req.params.course_id;
    const { itemTemplateIds } = req.body;

    // Handle empty array case
    const selectedIds = itemTemplateIds || [];

    // Verify the course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new NotFoundError();
    }

    // Check if the current user is the teacher of this course
    if (course.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // If there are selected item templates, verify they all exist
    if (selectedIds.length > 0) {
      const itemTemplates = await ItemTemplate.findAll({
        where: {
          id: selectedIds,
          isDeleted: false,
        },
      });

      if (itemTemplates.length !== selectedIds.length) {
        throw new BadRequestError('One or more item templates not found');
      }
    }

    // Get current active associations
    const currentAssociations = await CourseItemTemplate.findAll({
      where: {
        course_id: courseId,
        isDeleted: false,
      },
    });

    const currentIds = currentAssociations.map((assoc) => assoc.item_template_id);

    // Determine which items to add and which to remove
    const idsToAdd = selectedIds.filter((id: string) => !currentIds.includes(id));
    const idsToRemove = currentIds.filter((id: string) => !selectedIds.includes(id));

    // Array to track created/updated associations for publishing events
    const createdAssociations = [];
    const updatedAssociations = [];

    // Perform additions - create new associations
    for (const itemTemplateId of idsToAdd) {
      const existingSoftDeleted = await CourseItemTemplate.findOne({
        where: {
          course_id: courseId,
          item_template_id: itemTemplateId,
          isDeleted: true,
        },
      });

      if (existingSoftDeleted) {
        // Reuse soft-deleted record
        await CourseItemTemplate.update(
          {
            isDeleted: false,
            deletedAt: undefined,
          },
          {
            where: {
              id: existingSoftDeleted.id,
            },
          },
        );
        
        // Add to updated associations
        updatedAssociations.push({
          id: existingSoftDeleted.id,
          courseId,
          itemTemplateId,
          isDeleted: false
        });
      } else {
        // Create new association if no soft-deleted one exists
        const newAssociation = await CourseItemTemplate.create({
          course_id: courseId,
          item_template_id: itemTemplateId,
        });
        
        // Add to created associations
        createdAssociations.push({
          id: newAssociation.id,
          courseId,
          itemTemplateId,
          isDeleted: false
        });
      }
    }

    // Perform removals - soft delete associations
    if (idsToRemove.length > 0) {
      const associationsToRemove = await CourseItemTemplate.findAll({
        where: {
          course_id: courseId,
          item_template_id: {
            [Op.in]: idsToRemove,
          },
          isDeleted: false,
        },
      });
      
      // Update the associations
      await CourseItemTemplate.update(
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
        {
          where: {
            course_id: courseId,
            item_template_id: {
              [Op.in]: idsToRemove,
            },
            isDeleted: false,
          },
        },
      );
      
      // Add to updated associations
      for (const assoc of associationsToRemove) {
        updatedAssociations.push({
          id: assoc.id,
          courseId,
          itemTemplateId: assoc.item_template_id,
          isDeleted: true
        });
      }
    }

    // Get the updated list of active item templates
    const updatedItemTemplates = await ItemTemplate.findAll({
      where: {
        id: selectedIds,
        isDeleted: false,
      },
    });

    // Publish events for created associations
    for (const assoc of createdAssociations) {
      new CourseItemTemplateCreatedPublisher(natsWrapper.client).publish({
        id: assoc.id,
        courseId: assoc.courseId,
        itemTemplateId: assoc.itemTemplateId,
        isDeleted: assoc.isDeleted,
      });
    }

    // Publish events for updated associations
    for (const assoc of updatedAssociations) {
      new CourseItemTemplateUpdatedPublisher(natsWrapper.client).publish({
        id: assoc.id,
        courseId: assoc.courseId,
        itemTemplateId: assoc.itemTemplateId,
        isDeleted: assoc.isDeleted,
      });
    }

    res.status(200).send({
      message: 'Course item templates updated successfully',
      addedCount: idsToAdd.length,
      removedCount: idsToRemove.length,
      items: updatedItemTemplates,
    });
  },
);

export { router as updateCourseItemTemplateRouter };
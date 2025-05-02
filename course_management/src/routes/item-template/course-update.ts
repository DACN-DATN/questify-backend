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

    // Perform additions - create new associations
    for (const itemTemplateId of idsToAdd) {
      const existingSoftDeleted = await CourseItemTemplate.findOne({
        where: {
          course_id: courseId,
          item_template_id: itemTemplateId,
          isDeleted: true
        }
      });
      
      if (existingSoftDeleted) {
        // Reuse soft-deleted record
        await CourseItemTemplate.update(
          {
            isDeleted: false,
            deletedAt: undefined // Changed from null to undefined
          },
          {
            where: {
              id: existingSoftDeleted.id
            }
          }
        );
      } else {
        // Create new association if no soft-deleted one exists
        await CourseItemTemplate.create({
          course_id: courseId,
          item_template_id: itemTemplateId,
        });
      }
    }

    // Perform removals - soft delete associations
    if (idsToRemove.length > 0) {
      await CourseItemTemplate.update(
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
        {
          where: {
            course_id: courseId,
            item_template_id: {
              [Op.in]: idsToRemove
            },
            isDeleted: false,
          },
        },
      );
    }

    // Get the updated list of active item templates
    const updatedItemTemplates = await ItemTemplate.findAll({
      where: {
        id: selectedIds,
        isDeleted: false,
      },
    });

    res.status(200).send({
      message: 'Course item templates updated successfully',
      addedCount: idsToAdd.length,
      removedCount: idsToRemove.length,
      items: updatedItemTemplates,
    });
  }
);

export { router as updateCourseItemTemplateRouter };
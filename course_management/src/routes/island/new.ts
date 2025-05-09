import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import { Island } from '../../models/island';
import { PrerequisiteIsland } from '../../models/prerequisiteIsland';
import { Op } from 'sequelize';
import { sequelize } from '../../config/db';
import { detectCycle, recalculatePositions } from '../../services/island';
import {
  validateRequest,
  requireAuth,
  BadRequestError,
  ResourcePrefix,
} from '@datn242/questify-common';
import { IslandCreatedPublisher } from '../../events/publishers/island-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.post(
  ResourcePrefix.CourseManagement + '/:course_id/islands',
  requireAuth,
  [
    body('name').notEmpty().withMessage('Island name is required'),
    body('description').optional(),
    body('prerequisiteIslandIds')
      .optional()
      .isArray()
      .withMessage('Prerequisite island IDs must be an array'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const courseId = req.params.course_id;
    const { name, description, prerequisiteIslandIds } = req.body;

    try {
      const result = await sequelize.transaction(async (transaction) => {
        const course = await Course.findByPk(courseId, { transaction });
        if (!course) {
          throw new BadRequestError('Course not found');
        }

        const island = await Island.create(
          {
            name,
            description,
            position: 0,
            courseId,
          },
          { transaction },
        );

        if (prerequisiteIslandIds && prerequisiteIslandIds.length > 0) {
          const prereqIslands = await Island.findAll({
            where: {
              id: { [Op.in]: prerequisiteIslandIds },
              courseId,
            },
            transaction,
          });

          if (prereqIslands.length !== prerequisiteIslandIds.length) {
            throw new BadRequestError(
              'One or more prerequisite islands do not exist or do not belong to this course',
            );
          }

          const prereqPromises = prerequisiteIslandIds.map((prereqId: string) =>
            PrerequisiteIsland.create(
              {
                islandId: island.id,
                prerequisiteIslandId: prereqId,
              },
              { transaction },
            ),
          );

          await Promise.all(prereqPromises);

          if (await detectCycle(island.id)) {
            throw new BadRequestError(
              'Adding these prerequisites would create a cycle in the island dependencies',
            );
          }
        }

        await recalculatePositions(courseId, transaction);

        await island.reload({ transaction });

        return island;
      });
      new IslandCreatedPublisher(natsWrapper.client).publish({
        id: result.id,
        courseId: result.courseId,
        name: result.name,
        description: result.description,
        position: result.position,
        backgroundImage: result.backgroundImage,
      });
      res.status(201).send(result);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      console.error('Error creating island:', error);
      throw new BadRequestError('Failed to create island');
    }
  },
);

export { router as createIslandRouter };

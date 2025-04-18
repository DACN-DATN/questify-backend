import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import {
  NotAuthorizedError,
  NotFoundError,
  BadRequestError,
  requireAuth,
  validateRequest,
} from '@datn242/questify-common';
import { Island } from '../../models/island';
import { PrerequisiteIsland } from '../../models/prerequisiteIsland';
import { Op } from 'sequelize';
import { sequelize } from '../../config/db';
import { detectCycle, recalculatePositions } from '../../utils/island';

const router = express.Router();

router.patch(
  '/api/course-mgmt/:course_id/islands/:island_id',
  requireAuth,
  [
    body('name').optional().notEmpty().withMessage('Island name is required'),
    body('position')
      .optional()
      .notEmpty()
      .withMessage('Position is required')
      .isNumeric()
      .withMessage('Position must be a number'),
    body('prerequisiteIslandIds')
      .optional()
      .isArray()
      .withMessage('Prerequisite island IDs must be an array'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { course_id, island_id } = req.params;

    try {
      const result = await sequelize.transaction(async (transaction) => {
        const course = await Course.findByPk(course_id, { transaction });

        if (!course) {
          throw new NotFoundError();
        }

        if (course.teacherId !== req.currentUser!.id) {
          throw new NotAuthorizedError();
        }

        const island = await Island.findOne({
          where: {
            id: island_id,
            courseId: course_id,
          },
          transaction,
        });

        if (!island) {
          throw new NotFoundError();
        }

        const updateFields: Partial<Island> = {};
        const { name, description, position, backgroundImage, prerequisiteIslandIds } = req.body;

        if (name !== undefined) updateFields.name = name;
        if (description !== undefined) updateFields.description = description;
        if (position !== undefined) updateFields.position = position;
        if (backgroundImage !== undefined) updateFields.backgroundImage = backgroundImage;

        island.set(updateFields);
        await island.save({ transaction });

        if (prerequisiteIslandIds !== undefined) {
          const oldPrereqs = await PrerequisiteIsland.findAll({
            where: { islandId: island_id },
            transaction,
          });

          await PrerequisiteIsland.destroy({
            where: { islandId: island_id },
            transaction,
          });

          if (prerequisiteIslandIds.length > 0) {
            const prereqIslands = await Island.findAll({
              where: {
                id: { [Op.in]: prerequisiteIslandIds },
                courseId: course_id,
              },
              transaction,
            });

            if (prereqIslands.length !== prerequisiteIslandIds.length) {
              throw new BadRequestError(
                'One or more prerequisite islands do not exist or do not belong to this course'
              );
            }

            const prereqPromises = prerequisiteIslandIds.map((prereqId: string) =>
              PrerequisiteIsland.create(
                {
                  islandId: island_id,
                  prerequisiteIslandId: prereqId,
                },
                { transaction }
              )
            );

            await Promise.all(prereqPromises);

            if (await detectCycle(island_id, transaction)) {
              await PrerequisiteIsland.destroy({
                where: { islandId: island_id },
                transaction,
              });

              if (oldPrereqs.length > 0) {
                const restorePromises = oldPrereqs.map(oldPrereq =>
                  PrerequisiteIsland.create({
                    islandId: oldPrereq.islandId,
                    prerequisiteIslandId: oldPrereq.prerequisiteIslandId
                  }, { transaction })
                );
                await Promise.all(restorePromises);
              }

              throw new BadRequestError(
                'Adding these prerequisites would create a cycle in the island dependencies'
              );
            }
          }
        }

        await recalculatePositions(course_id, transaction);

        await island.reload({ transaction });

        return island;
      });

      res.send(result);
    } catch (error) {
      if (error instanceof NotFoundError ||
        error instanceof NotAuthorizedError ||
        error instanceof BadRequestError) {
        throw error;
      }
      console.error('Error updating island:', error);
      throw new BadRequestError('Failed to update island');
    }
  }
);

export { router as updateIslandRouter };
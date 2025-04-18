import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@datn242/questify-common';
import { Island } from '../../models/island';
import { Level } from '../../models/level';

const router = express.Router();

router.patch(
  '/api/course-mgmt/islands/:island_id/level/:level_id',
  requireAuth,
  [
    body('name').optional().isString().withMessage('Name must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('position').optional().isNumeric().withMessage('Position must be a number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { island_id, level_id } = req.params;
    const island = await Island.findByPk(island_id, {
      include: [
        {
          model: Course,
          as: 'Course',
          required: false,
        },
      ],
    });
    if (!island) {
      throw new NotFoundError();
    }

    const course = island.get('Course') as Course;

    if (course.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const level = await Level.findOne({
      where: {
        id: level_id,
        islandId: island.id,
      },
    });

    if (!level) {
      throw new NotFoundError();
    }

    const updateFields: Partial<Level> = {};
    const { name, description, position } = req.body;

    if (name !== undefined) updateFields['name'] = name;
    if (description !== undefined) updateFields['description'] = description;
    if (position !== undefined) updateFields['position'] = position;
    level.set(updateFields);

    await level.save();
    res.send(level);
  },
);

export { router as updateLevelRouter };

import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
  ResourcePrefix,
} from '@datn242/questify-common';
import { Island } from '../../models/island';

const router = express.Router();

router.put(
  ResourcePrefix.CourseManagement + '/:course_id/islands/:island_id',
  requireAuth,
  [
    body('name').optional().notEmpty().withMessage('Island name is required'),
    body('position')
      .optional()
      .notEmpty()
      .withMessage('Postion is required')
      .isNumeric()
      .withMessage('Position must be a number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { course_id, island_id } = req.params;
    const course = await Course.findByPk(course_id);

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
    });

    if (!island) {
      throw new NotFoundError();
    }

    const updateFields: Partial<Island> = {};
    const { name, description, position, backgroundImage } = req.body;

    if (name !== undefined) updateFields['name'] = name;
    if (description !== undefined) updateFields['description'] = description;
    if (position !== undefined) updateFields['position'] = position;
    if (backgroundImage !== undefined) updateFields['backgroundImage'] = backgroundImage;
    island.set(updateFields);

    await island.save();
    res.send(island);
  },
);

export { router as updateIslandRouter };

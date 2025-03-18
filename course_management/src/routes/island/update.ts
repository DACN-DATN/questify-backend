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

const router = express.Router();

router.put(
  '/api/course-mgmt/:course_id/islands/:island_id',
  requireAuth,
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

    const { name, description, position, backgroundImage } = req.body;
    island.set({
      name,
      description,
      position,
      backgroundImage,
    });

    await island.save();
    res.send(island);
  },
);

export { router as updateIslandRouter };

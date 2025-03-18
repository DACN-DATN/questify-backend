import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { Island } from '../../models/island';
import { validateRequest } from '@datn242/questify-common';

const router = express.Router();

router.post(
  '/api/course-mgmt/:course_id/islands',
  validateRequest,
  async (req: Request, res: Response) => {
    const course = await Course.findByPk(req.params.course_id);

    if (!course) {
      throw new Error('Course not found');
    }

    const { name, description, position, backgroundImage } = req.body;
    const island = Island.build({
      name,
      description,
      position,
      backgroundImage,
      courseId: course.id,
    });

    await island.save();
    res.status(201).send(island);
  },
);

export { router as createIslandRouter };

import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import {
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
  requireAuth,
  ResourcePrefix,
} from '@datn242/questify-common';

const router = express.Router();

router.patch(
  ResourcePrefix.CourseManagement + '/:course_id',
  requireAuth,
  [body('name').optional().notEmpty().withMessage('Course name is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const course = await Course.findByPk(req.params.course_id);

    if (!course) {
      throw new NotFoundError();
    }

    if (course.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const updateFields: Partial<Course> = {};
    const { name, description, backgroundImage } = req.body;
    if (name !== undefined) updateFields['name'] = name;
    if (description !== undefined) updateFields['description'] = description;
    if (backgroundImage !== undefined) updateFields['backgroundImage'] = backgroundImage;
    course.set(updateFields);

    await course.save();
    res.send(course);
  },
);

export { router as updateCourseRouter };

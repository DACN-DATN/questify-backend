import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import {
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
  requireAuth,
} from '@datn242/questify-common';

const router = express.Router();

router.put(
  '/api/course-mgmt/:course_id',
  requireAuth,
  [
    body('name').notEmpty().withMessage('Course name is required').trim(),
    body('uploadDate')
      .optional({ nullable: true })
      .isDate()
      .withMessage('Upload date must be a valid date'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const course = await Course.findByPk(req.params.course_id);

    if (!course) {
      throw new NotFoundError();
    }

    if (course.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const { name, description, uploadDate, backgroundImage } = req.body;
    course.set({
      name,
      description,
      uploadDate,
      backgroundImage,
    });

    await course.save();
    res.send(course);
  },
);

export { router as updateCourseRouter };

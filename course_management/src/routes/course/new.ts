import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import { validateRequest, requireAuth } from '@datn242/questify-common';

const router = express.Router();

router.post(
  '/api/course-mgmt',
  requireAuth,
  [
    body('name').notEmpty().withMessage('Course name is required').trim(),
    body('uploadDate')
      .isDate()
      .withMessage('Upload date must be a valid date')
      .notEmpty()
      .withMessage('Upload date is required'),
    body('teacherId').isNumeric().withMessage('Teacher ID must be a valid number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, description, uploadDate, backgroundImage } = req.body;
    const course = Course.build({
      name,
      description,
      uploadDate,
      backgroundImage,
      teacherId: req.currentUser!.id,
    });

    await course.save();
    res.status(201).send(course);
  },
);

export { router as createCourseRouter };

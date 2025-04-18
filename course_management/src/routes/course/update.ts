import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import {
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
  requireAuth,
} from '@datn242/questify-common';
import { CourseCategory } from '@datn242/questify-common';

const router = express.Router();

router.patch(
  '/api/course-mgmt/:course_id',
  requireAuth,
  [
    body('name').optional().notEmpty().withMessage('Course name is required'),
    body('category')
      .optional()
      .isIn(Object.values(CourseCategory))
      .withMessage('Invalid course category'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('learningObjectives')
      .optional()
      .isArray()
      .withMessage('Learning objectives must be an array of strings')
      .custom((arr: unknown[]) => arr.every((item): item is string => typeof item === 'string'))
      .withMessage('All learning objectives must be strings'),
    body('requirements')
      .optional()
      .isArray()
      .withMessage('Requirements must be an array of strings')
      .custom((arr: unknown[]) => arr.every((item): item is string => typeof item === 'string'))
      .withMessage('All requirements must be strings'),
    body('targetAudience')
      .optional()
      .isArray()
      .withMessage('Target audience must be an array of strings')
      .custom((arr: unknown[]) => arr.every((item): item is string => typeof item === 'string'))
      .withMessage('All target audience values must be strings'),
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

    const {
      name,
      description,
      backgroundImage,
      category,
      price,
      learningObjectives,
      requirements,
      targetAudience,
    } = req.body;

    const updateFields: Partial<typeof course> = {};

    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (backgroundImage !== undefined) updateFields.backgroundImage = backgroundImage;
    if (category !== undefined) updateFields.category = category;
    if (price !== undefined) updateFields.price = price;
    if (learningObjectives !== undefined) updateFields.learningObjectives = learningObjectives;
    if (requirements !== undefined) updateFields.requirements = requirements;
    if (targetAudience !== undefined) updateFields.targetAudience = targetAudience;

    course.set(updateFields);

    await course.save();
    res.send(course);
  },
);

export { router as updateCourseRouter };

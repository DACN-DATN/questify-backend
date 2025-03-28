import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
  ResourcePrefix,
} from '@datn242/questify-common';
import { query } from 'express-validator';
import { User } from '../../models/user';
import { Feedback } from '../../models/feedback';
import { Course } from '../../models/course';
import { Island } from '../../models/island';
import { Level } from '../../models/level';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/feedback',
  requireAuth,
  [
    query('student-id')
      .exists()
      .withMessage('student-id is required')
      .isUUID()
      .withMessage('student-id must be a valid UUID'),
    query('course-id')
      .optional()
      .isUUID()
      .withMessage('student-id must be a valid UUID'),
    query('island-id')
      .optional()
      .isUUID()
      .withMessage('student-id must be a valid UUID'),
    query('level-id')
      .optional()
      .isUUID()
      .withMessage('student-id must be a valid UUID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const student_id = req.query['student-id'] as string;
    const course_id = req.query['course-id'] as string | undefined;
    const island_id = req.query['island-id'] as string | undefined;
    const level_id = req.query['level-id'] as string | undefined;

    if (!course_id && !island_id && !level_id) {
      throw new BadRequestError('At least one of course-id, island-id, or level-id is required');
    }

    if (!student_id) {
      throw new BadRequestError('Student ID is required.');
    }

    const student = await User.findByPk(student_id);

    if (!student) {
      throw new BadRequestError('Student not found');
    }


    res.send();
  },
);

const get

export { router as showHintRouter };

import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
  ResourcePrefix,
} from '@datn242/questify-common';
import { param } from 'express-validator';
import { Course } from '../models/course';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/courses/:course_id/leaderboard',
  requireAuth,
  [param('course_id').isUUID().withMessage('course_id must be a valid UUID')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { course_id } = req.params;

    const course = await Course.findByPk(course_id);

    if (!course) {
      throw new NotFoundError();
    }
  },
);

export { router as showLeaderboardRouter };

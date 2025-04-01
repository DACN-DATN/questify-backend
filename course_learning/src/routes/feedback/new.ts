import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  requireAuth,
  UserRole,
  validateRequest,
  ResourcePrefix,
  BadRequestError,
} from '@datn242/questify-common';
import { body } from 'express-validator';
import { User } from '../../models/user';
import { Feedback } from '../../models/feedback';
import { Attempt } from '../../models/attempt';

const router = express.Router();

router.post(
  ResourcePrefix.CourseLearning + '/feedback',
  requireAuth,
  [
    body('student_id')
      .exists()
      .withMessage('student_id is required')
      .isUUID()
      .withMessage('course_id must be a valid UUID'),
    body('attemp_id')
      .exists()
      .withMessage('attemp_id is required')
      .isUUID()
      .withMessage('attempt_id must be a valid UUID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { student_id, attempt_id, message } = req.body;

    if (req.currentUser!.role !== UserRole.Teacher) {
      throw new NotAuthorizedError();
    }

    const student = await User.findByPk(student_id);
    if (!student) {
      throw new BadRequestError('Student not found');
    }

    const attempt = await Attempt.findByPk(attempt_id);
    if (!attempt) {
      throw new BadRequestError('Attempt not found');
    }

    const feedback = await Feedback.create({
      message,
      teacherId: req.currentUser!.id,
      attemptId: attempt.id,
    });
  },
);

export { router as createFeedbackRouter };

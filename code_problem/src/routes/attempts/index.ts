import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import { Attempt } from '../../models/attempt';
import { requireAuth, validateRequest, ResourcePrefix, NotFoundError } from '@datn242/questify-common';
import { Level } from '../../models/level';
import { User } from '../../models/user';

const router = express.Router();

router.get(
  ResourcePrefix.CodeProblem + '/attempts',
  requireAuth,
  [
    query('student-id')
      .exists()
      .withMessage('student-id is required')
      .isUUID()
      .withMessage('student-id must be a valid UUID'),
    query('level-id')
      .exists()
      .withMessage('level-id is required')
      .isUUID()
      .withMessage('level-id must be a valid UUID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const student_id = req.query['student-id'] as string;
    const level_id = req.query['level-id'] as string;

    const student = await User.findByPk(student_id);

    if (!student) {
      throw new NotFoundError();
    }

    const level = await Level.findByPk(level_id);

    if (!level) {
      throw new NotFoundError();
    }

    const attempts = await Attempt.findAll({ where: { levelId: level_id, userId: student_id } });
    res.status(201).send(attempts);
  },
);

export { router as indexAttemptRouter };

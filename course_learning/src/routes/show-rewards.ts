import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth, validateRequest } from '@datn242/questify-common';
import { param } from 'express-validator';
import { User } from '../models/user';
import { Reward } from '../models/reward';

const router = express.Router();

router.get(
  '/api/course-learning/students/:student_id/rewards',
  requireAuth,
  [
    param('level-id')
      .exists()
      .withMessage('level-id is required')
      .isUUID()
      .withMessage('level-id must be a valid UUID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { student_id } = req.params;

    const student = await User.findByPk(student_id, {
      include: [
        {
          model: Reward,
          as: 'rewards',
        },
      ],
    });

    if (!student) {
      throw new BadRequestError('Student not found.');
    }

    const rewards = student.rewards || [];

    res.send(rewards);
  },
);

export { router as showRewardsRouter };

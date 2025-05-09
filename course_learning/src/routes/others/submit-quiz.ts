import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  ResourcePrefix,
  BadRequestError,
  NotAuthorizedError,
} from '@datn242/questify-common';
import { Challenge } from '../../models/challenge';
import { Level } from '../../models/level';
import { UserLevel } from '../../models/user-level';
import { body, param } from 'express-validator';

const router = express.Router();

router.post(
  ResourcePrefix.CourseLearning + '/quizzes/:quiz_id',
  requireAuth,
  [
    body('challenge_id')
      .exists()
      .withMessage('challenge-id is required')
      .isUUID()
      .withMessage('challenge-id must be a valid UUID'),
    param('quiz_id').isUUID().withMessage('quiz-id must be a valid UUID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { challenge_id } = req.body;
    // const { quiz_id } = req.params;

    const challenge = await Challenge.findOne({
      where: { id: challenge_id },
    });
    if (!challenge) {
      throw new BadRequestError('Challenge not found');
    }

    const level = await Level.findOne({
      where: {
        id: challenge.levelId,
      },
    });

    if (!level) {
      throw new BadRequestError('Level not found');
    }

    const progress = await UserLevel.findOne({
      where: {
        userId: req.currentUser!.id,
        levelId: level.id,
      },
    });

    if (!progress) {
      throw new NotAuthorizedError();
    }

    //TODO: implement logic of submitting quiz here

    res.status(200).send({});
  },
);

export { router as submitQuizRouter };

import express, { Request, Response } from 'express';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  ResourcePrefix,
  BadRequestError,
  NotAuthorizedError,
} from '@datn242/questify-common';
import { Challenge } from '../../models/challenge';
import { Minigame } from '../../models/minigame';
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
    const { quiz_id } = req.params;
    //current: eager load + lazy load error -> normal query
    //todo: may implement eager load here
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

    const quiz = await Minigame.findOne({
      where: {
        id: quiz_id,
        challengeId: challenge.id,
      },
    });

    if (!quiz) {
      throw new NotFoundError();
    }

    //TODO: implement logic of submitting quiz here

    res.status(200).send(quiz);
  },
);

export { router as submitQuizRouter };

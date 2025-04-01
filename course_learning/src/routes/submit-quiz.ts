import express, { Request, Response } from 'express';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  ResourcePrefix,
  BadRequestError,
} from '@datn242/questify-common';
import { Challenge } from '../models/challenge';
import { Minigame } from '../models/minigame';
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
    const challenge = await Challenge.findByPk(challenge_id);
    if (!challenge) {
      throw new BadRequestError('Challenge not found');
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

    res.status(201).send(quiz);
  },
);

export { router as submitQuizRouter };

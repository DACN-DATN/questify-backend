import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth } from '@datn242/questify-common';
import { Level } from '../../models/level';
import { Minigame } from '../../models/minigame';

const router = express.Router();

router.post(
  '/api/course-learning/levels/:level_id/quizzes/:quiz_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { level_id, quiz_id } = req.params;
    const level = await Level.findByPk(level_id);
    if (!level) {
      throw new NotFoundError();
    }

    const quiz = await Minigame.findOne({
      where: {
        id: quiz_id,
        levelId: level.id,
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

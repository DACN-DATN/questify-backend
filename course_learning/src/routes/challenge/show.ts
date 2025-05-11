import express, { Request, Response } from 'express';
import { BadRequestError, ResourcePrefix } from '@datn242/questify-common';
import { Challenge } from '../../models/challenge';
import { Slide } from '../../models/slide';
import { Level } from '../../models/level';
import { UserLevel } from '../../models/user-level';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/challenge/:challenge_id',
  async (req: Request, res: Response) => {
    const challenge = await Challenge.findByPk(req.params.challenge_id, {
      include: [
        {
          model: Slide,
          as: 'Slides',
          required: false,
          order: [['slideNumber', 'ASC']],
        },
        {
          model: Level,
          as: 'Level',
          required: false,
        },
      ],
    });

    if (!challenge) {
      throw new BadRequestError('Challenge not found');
    }

    const userLevel = await UserLevel.findOne({
      where: {
        userId: req.currentUser!.id,
        levelId: challenge.levelId,
      },
    });

    if (!userLevel) {
      throw new BadRequestError('Student have not enrolled this course');
    }
    const challengeData = challenge.toJSON();

    res.send(challengeData);
  },
);

export { router as showChallengeRouter };

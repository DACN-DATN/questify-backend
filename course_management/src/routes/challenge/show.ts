import express, { Request, Response } from 'express';
import { NotFoundError, ResourcePrefix } from '@datn242/questify-common';
import { Challenge } from '../../models/challenge';
import { Slide } from '../../models/slide';

const router = express.Router();

router.get(
  ResourcePrefix.CourseManagement + '/challenge/:challenge_id',
  async (req: Request, res: Response) => {
    const challenge = await Challenge.findByPk(req.params.challenge_id, {
      include: [
        {
          model: Slide,
          as: 'Slides',
          required: false,
          order: [['slideNumber', 'ASC']],
        },
      ],
    });

    if (!challenge) {
      throw new NotFoundError();
    }

    const challengeData = challenge.toJSON();

    res.send(challengeData);
  },
);

export { router as showChallengeRouter };

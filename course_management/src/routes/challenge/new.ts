import express, { Request, Response } from 'express';
import { Island } from '../../models/island';
import { Level } from '../../models/level';
import {
  validateRequest,
  requireAuth,
  BadRequestError,
  NotAuthorizedError,
  ResourcePrefix,
} from '@datn242/questify-common';
import { Course } from '../../models/course';
import { Challenge } from '../../models/challenge';

const router = express.Router();

router.post(
  ResourcePrefix.CourseManagement + '/level/:level_id/challenge',
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const { level_id } = req.params;
    const level = await Level.findByPk(level_id);

    if (!level) {
      throw new BadRequestError('Level not found');
    }

    const island = await Island.findByPk(level.islandId, {
      include: [
        {
          model: Course,
          as: 'Course',
          required: false,
        },
      ],
    });

    if (!island) {
      throw new BadRequestError('Island not found');
    }

    const course = island.get('Course') as Course;

    if (course.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const challenge = Challenge.build({
      levelId: level.id.toString(),
    });

    await challenge.save();
    res.status(201).send(challenge);
  },
);

export { router as createChallengeRouter };

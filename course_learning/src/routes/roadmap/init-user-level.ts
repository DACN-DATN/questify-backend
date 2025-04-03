import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth, ResourcePrefix } from '@datn242/questify-common';
import { User } from '../../models/user';
import { UserLevel } from '../../models/user-level';
import { Island } from '../../models/island';
import { Level } from '../../models/level';
import { CompletionStatus } from '@datn242/questify-common';

const router = express.Router();

router.post(
  ResourcePrefix.CourseLearning + '/roadmap/islands/:island_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { course_id } = req.params;

    const island = await Island.findByPk(course_id);
    if (!island) {
      throw new BadRequestError('Island not found');
    }

    const student = await User.findByPk(req.currentUser!.id);
    if (!student) {
      throw new BadRequestError('Current student not found');
    }

    if (student.role !== 'student') {
      throw new BadRequestError('Only student can init user level');
    }

    const levels = await Level.findAll({
      where: {
        islandId: island.id,
      },
    });
    if (!levels) {
      throw new BadRequestError('Levels not found');
    }

    const userLevels: UserLevel[] = [];

    for (const level of levels) {
      const userLevel = UserLevel.build({
        userId: student.id,
        levelId: level.id,
        point: 0,
        completionStatus: CompletionStatus.Locked,
      });
      await userLevel.save();
      userLevels.push(userLevel);
    }

    res.status(201).send({ userLevels });
  },
);

export { router as initUserIslandRouter };

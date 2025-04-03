import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth, ResourcePrefix } from '@datn242/questify-common';
import { User } from '../../models/user';
import { UserLevel } from '../../models/user-level';
import { Level } from '../../models/level';
import { Island } from '../../models/island';
import { Op } from 'sequelize';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/roadmap/islands/:island_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { island_id } = req.params;

    const island = await Island.findByPk(island_id);
    if (!island) {
      throw new BadRequestError('Course not found');
    }

    const student = await User.findByPk(req.currentUser!.id);
    if (!student) {
      throw new BadRequestError('Current student not found');
    }

    const levels = await Level.findAll({
      where: {
        islandId: island.id,
      },
    });
    if (!levels) {
      throw new BadRequestError('Levels not found');
    }
    const levelIds = levels.map((level) => level.id);

    const userLevels = await UserLevel.findAll({
      where: {
        userId: student.id,
        levelId: {
          [Op.in]: levelIds,
        },
      },
      include: [
        {
          model: Level,
          as: 'levels',
        },
      ],
    });
    res.send({ userLevels });
  },
);

export { router as showUserLevelRouter };

import express, { Request, Response } from 'express';
import { NotFoundError } from '@datn242/questify-common';
import { Level } from '../../models/level';
import { Island } from '../../models/island';

const router = express.Router();

router.get(
  '/api/course-learning/islands/:island_id/levels/:level_id',
  async (req: Request, res: Response) => {
    const { island_id, level_id } = req.params;
    const island = await Island.findByPk(island_id);

    if (!island) {
      throw new NotFoundError();
    }

    const level = await Level.findOne({
      where: {
        id: level_id,
        islandId: island.id,
      },
    });

    if (!level) {
      throw new NotFoundError();
    }

    res.send(level);
  },
);

export { router as showLevelRouter };

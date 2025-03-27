import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth } from '@datn242/questify-common';
import { Level } from '../../models/level';
import { Hint } from '../../models/hint';

const router = express.Router();

router.get(
  '/api/course-learning/levels/:level_id/hints',
  requireAuth,
  async (req: Request, res: Response) => {
    const { level_id } = req.params;
    const level = await Level.findByPk(level_id);

    if (!level) {
      throw new NotFoundError();
    }

    const hints = await Hint.findAll({ where: { levelId: level_id } });
    res.send(hints);
  },
);

export { router as showHintRouter };

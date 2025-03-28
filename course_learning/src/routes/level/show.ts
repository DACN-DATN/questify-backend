import express, { Request, Response } from 'express';
import { NotFoundError, ResourcePrefix } from '@datn242/questify-common';
import { Level } from '../../models/level';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/levels/:level_id',
  async (req: Request, res: Response) => {
    const { level_id } = req.params;

    const level = await Level.findByPk(level_id);

    if (!level) {
      throw new NotFoundError();
    }

    res.send(level);
  },
);

export { router as showLevelRouter };

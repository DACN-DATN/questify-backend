import express, { Request, Response } from 'express';
import { NotFoundError } from '@datn242/questify-common';
import { Level } from '../../models/level';

const router = express.Router();

router.get('/api/course-learning/levels/:level_id', async (req: Request, res: Response) => {
  const { level_id } = req.params;

  const level = await Level.findByPk(level_id);

  if (!level) {
    throw new NotFoundError();
  }

  res.send(level);
});

export { router as showLevelRouter };

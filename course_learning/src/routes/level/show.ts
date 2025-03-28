import express, { Request, Response } from 'express';
import { NotFoundError, ResourcePrefix, validateRequest } from '@datn242/questify-common';
import { Level } from '../../models/level';
import { param } from 'express-validator';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/levels/:level_id',
  [param('level_id').isUUID().withMessage('level_id must be a valid UUID')],
  validateRequest,
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

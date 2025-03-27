import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@datn242/questify-common';
import { query } from 'express-validator';
import { Level } from '../../models/level';
import { Hint } from '../../models/hint';

const router = express.Router();

router.get(
  '/api/course-learning/hints',
  requireAuth,
  [
    // Validate that level-id exists and is a UUID
    query('level-id')
      .exists()
      .withMessage('level-id is required')
      .isUUID()
      .withMessage('level-id must be a valid UUID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const level_id = req.query['level-id'] as string;

    if (!level_id) {
      throw new BadRequestError('Level ID is required.');
    }
    const level = await Level.findByPk(level_id);

    if (!level) {
      throw new NotFoundError();
    }

    const hints = await Hint.findAll({ where: { levelId: level_id } });
    res.send(hints);
  },
);

export { router as showHintRouter };

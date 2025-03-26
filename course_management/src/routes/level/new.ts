import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Island } from '../../models/island';
import { Level } from '../../models/level';
import { validateRequest, requireAuth, BadRequestError } from '@datn242/questify-common';

const router = express.Router();

router.post(
  '/api/course-mgmt/islands/:island_id/level',
  requireAuth,
  [
    body('name').notEmpty().withMessage('Level name is required'),
    body('position')
      .notEmpty()
      .withMessage('Level postion is required')
      .isInt()
      .withMessage('Level postion must be an integer'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { island_id } = req.params;
    const island = await Island.findByPk(island_id);

    if (!island) {
      throw new BadRequestError('Island not found');
    }

    const { name, description, position } = req.body;
    const level = Level.build({
      name,
      description,
      position,
      islandId: island.id.toString(),
    });

    await level.save();
    res.status(201).send(level);
  },
);

export { router as createLevelRouter };

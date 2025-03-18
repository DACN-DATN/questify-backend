import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Island } from '../../models/island';
import { Level } from '../../models/level';
import { validateRequest, requireAuth } from '@datn242/questify-common';

const router = express.Router();

router.post(
  '/api/course-mgmt/islands/:island_id/level',
  requireAuth,
  [
    body('name').notEmpty().withMessage('Course name is required').trim(),
    body('postion')
      .notEmpty()
      .withMessage('Course postion is required')
      .isInt()
      .withMessage('Position must be an integer'),
    body('islandId').isUUID(4).withMessage('Island ID must be a valid UUID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { island_id } = req.params;
    const island = await Island.findByPk(island_id);

    if (!island) {
      throw new Error('Island not found');
    }

    const { name, description, position, backgroundImage } = req.body;
    const level = Level.build({
      name,
      description,
      position,
      islandId: island.id,
    });

    await level.save();
    res.status(201).send(level);
  },
);

export { router as createLevelRouter };

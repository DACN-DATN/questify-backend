import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { Island } from '../../models/island';
import { Level } from '../../models/level';
import { validateRequest } from '@datn242/questify-common';

const router = express.Router();

router.post(
  '/api/course-mgmt/islands/:island_id/level',
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

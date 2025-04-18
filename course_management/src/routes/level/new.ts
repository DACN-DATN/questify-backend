import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Island } from '../../models/island';
import { Level } from '../../models/level';
import {
  validateRequest,
  requireAuth,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
} from '@datn242/questify-common';
import { Course } from '../../models/course';

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
    const island = await Island.findByPk(island_id, {
      include: [
        {
          model: Course,
          as: 'Course',
          required: false,
        },
      ],
    });

    if (!island) {
      throw new BadRequestError('Island not found');
    }

    if (!island) {
      throw new NotFoundError();
    }

    const course = island.get('Course') as Course;

    if (course.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const { name, description, position } = req.body;
    const level = Level.build({
      name,
      description,
      position,
      islandId: island.id.toString(),
    });

    await level.save();
    // await new LevelCreatedPublisher(natsWrapper.client).publish({
    //   id: level.id,
    //   teacherId: course.teacherId,
    // });
    res.status(201).send(level);
  },
);

export { router as createLevelRouter };

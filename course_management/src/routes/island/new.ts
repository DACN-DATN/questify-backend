import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import { Island } from '../../models/island';
import { validateRequest, requireAuth, BadRequestError } from '@datn242/questify-common';

const router = express.Router();

router.post(
  '/api/course-mgmt/:course_id/islands',
  requireAuth,
  [
    body('name').notEmpty().withMessage('Island name is required'),
    body('position')
      .notEmpty()
      .withMessage('Postion is required')
      .isNumeric()
      .withMessage('Position must be a number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const course = await Course.findByPk(req.params.course_id);

    if (!course) {
      throw new BadRequestError('Course not found');
    }

    const { name, description, position, backgroundImage } = req.body;
    const island = Island.build({
      name,
      description,
      position,
      backgroundImage,
      courseId: course.id.toString(),
    });

    await island.save();
    res.status(201).send(island);
  },
);

export { router as createIslandRouter };

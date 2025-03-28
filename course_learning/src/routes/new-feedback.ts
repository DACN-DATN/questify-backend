import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  requireAuth,
  validateRequest,
  ResourcePrefix,
  BadRequestError,
} from '@datn242/questify-common';
import { body } from 'express-validator';
import { Course } from '../models/course';
import { Island } from '../models/island';
import { Level } from '../models/level';
import { Progress } from '../models/progress';
import { User } from '../models/user';
import { Feedback } from '../models/feedback';

const router = express.Router();

router.post(
  ResourcePrefix.CourseLearning + '/feedback',
  requireAuth,
  [
    body('student_id')
      .exists()
      .withMessage('student_id is required')
      .isUUID()
      .withMessage('course_id must be a valid UUID'),
    body('course_id').optional().isUUID().withMessage('course_id must be a valid UUID'),
    body('island_id').optional().isUUID().withMessage('island_id must be a valid UUID'),
    body('level_id').optional().isUUID().withMessage('level_id must be a valid UUID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { student_id, course_id, island_id, level_id, description } = req.body;

    if (!course_id && !island_id && !level_id) {
      throw new BadRequestError('At least one of course_id, island_id, or level_id is required');
    }

    const student = await User.findByPk(student_id);

    if (!student) {
      throw new BadRequestError('Student not found');
    }

    if (level_id) {
      return await addLevelFeedback(description, student, level_id, req, res);
    } else if (island_id) {
      return await addIslandFeedback(description, student, island_id, req, res);
    } else if (course_id) {
      return await addCourseFeedback(description, student, course_id, req, res);
    }
  },
);

const addCourseFeedback = async (
  description: string,
  student: User,
  course_id: string,
  req: Request,
  res: Response,
) => {
  const course = await Course.findByPk(course_id);
  if (!course) {
    throw new BadRequestError('Course not found');
  }

  if (course.teacherId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  const progress = await Progress.findOne({
    where: {
      courseId: course_id,
      studentId: student.id,
    },
  });

  if (!progress) {
    throw new BadRequestError('Progress not found');
  }

  const feedback = Feedback.build({
    description,
    teacherId: req.currentUser!.id,
    progressId: progress.id,
  });

  await feedback.save();
  res.status(201).send(feedback);
};

const addIslandFeedback = async (
  description: string,
  student: User,
  island_id: string,
  req: Request,
  res: Response,
) => {
  const island = await Island.findByPk(island_id);
  if (!island) {
    throw new BadRequestError('Island not found');
  }

  const course = await island.getCourse();

  if (course.teacherId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  const progress = await Progress.findOne({
    where: {
      islandId: island_id,
      studentId: student.id,
    },
  });

  if (!progress) {
    throw new BadRequestError('Progress not found');
  }

  const feedback = Feedback.build({
    description,
    teacherId: req.currentUser!.id,
    progressId: progress.id,
  });

  await feedback.save();
  res.status(201).send(feedback);
};

const addLevelFeedback = async (
  description: string,
  student: User,
  level_id: string,
  req: Request,
  res: Response,
) => {
  const level = await Level.findByPk(level_id);
  if (!level) {
    throw new BadRequestError('Level not found');
  }

  const island = await level.getIsland();

  const course = await island.getCourse();

  if (course.teacherId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  const progress = await Progress.findOne({
    where: {
      levelId: level_id,
      studentId: student.id,
    },
  });

  if (!progress) {
    throw new BadRequestError('Progress not found');
  }

  const feedback = Feedback.build({
    description,
    teacherId: req.currentUser!.id,
    progressId: progress.id,
  });

  await feedback.save();
  res.status(201).send(feedback);
};

export { router as newFeedbackRouter };

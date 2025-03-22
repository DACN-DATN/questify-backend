import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { NotAuthorizedError, requireAuth } from '@datn242/questify-common';
import { NotFoundError, BadRequestError } from '@datn242/questify-common';

const router = express.Router();

router.put('/api/course-mgmt/:course_id', requireAuth, async (req: Request, res: Response) => {
  const courseId = req.params.course_id;

  const course = await Course.findByPk(courseId);

  if (!course) {
    throw new NotFoundError();
  }

  if (course.teacherId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if (course.isDeleted) {
    throw new BadRequestError('Course is already deleted');
  }

  course.set({
    isDeleted: true,
    deletedAt: new Date(),
  });

  await course.save();

  res.send(course);
});

export { router as deleteCourseRouter };

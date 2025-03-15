import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { NotAuthorizedError, validateRequest } from '@datn242/questify-common';
import { NotFoundError } from '@datn242/questify-common';

const router = express.Router();

router.put('/api/course-mgmt/:id', validateRequest, async (req: Request, res: Response) => {
  const course = await Course.findByPk(req.params.id);

  if (!course) {
    throw new NotFoundError();
  }

  if (course.teacherId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  const { name, description, uploadDate, backgroundImage } = req.body;
  course.set({
    name,
    description,
    uploadDate,
    backgroundImage,
  });

  await course.save();
  res.send(course);
});

export { router as updateCourseRouter };

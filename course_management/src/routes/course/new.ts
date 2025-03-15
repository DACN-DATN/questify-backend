import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { validateRequest } from '@datn242/questify-common';

const router = express.Router();

router.post('/api/course-mgmt', validateRequest, async (req: Request, res: Response) => {
  const { name, description, uploadDate, backgroundImage } = req.body;
  const course = Course.build({
    name,
    description,
    uploadDate,
    backgroundImage,
    teacherId: req.currentUser!.id,
  });

  await course.save();
  res.status(201).send(course);
});

export { router as createCourseRouter };

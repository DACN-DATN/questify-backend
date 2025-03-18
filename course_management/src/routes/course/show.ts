import express, { Request, Response } from 'express';
import { NotFoundError } from '@datn242/questify-common';
import { Course } from '../../models/course';

const router = express.Router();

router.get('/api/course-mgmt/:course_id', async (req: Request, res: Response) => {
  const course = await Course.findByPk(req.params.course_id);

  if (!course) {
    throw new NotFoundError();
  }

  res.send(course);
});

export { router as showCourseRouter };

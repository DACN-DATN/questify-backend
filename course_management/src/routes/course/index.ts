import express, { Request, Response } from 'express';
import { Course } from '../../models/course';

const router = express.Router();

router.get('/api/course-mgmt', async (req: Request, res: Response) => {
  const courses = await Course.findAll({});

  res.send(courses);
});

export { router as indexCourseRouter };

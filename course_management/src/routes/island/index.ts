import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { NotAuthorizedError, NotFoundError } from '@datn242/questify-common';
import { Island } from '../../models/island';

const router = express.Router();

router.get('/api/course-mgmt/:course_id/islands', async (req: Request, res: Response) => {
  const courseId = req.params.course_id;
  const course = await Course.findByPk(courseId);

  if (!course) {
    throw new NotFoundError();
  }

  if (course.teacherId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  const islands = await Island.findAll({
    where: {
      courseId: course.id,
    }
  })

  res.send(islands);
});

export { router as indexIslandRouter };

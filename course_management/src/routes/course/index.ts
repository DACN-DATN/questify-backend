import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { ResourcePrefix, CourseStatus } from '@datn242/questify-common';
import { Op } from 'sequelize';

const router = express.Router();

router.get(ResourcePrefix.CourseManagement, async (req: Request, res: Response) => {
  const courses = await Course.findAll({
    where: {
      status: {
        [Op.not]: CourseStatus.Rejected,
      },
    },
  });

  res.send(courses);
});

export { router as indexCourseRouter };

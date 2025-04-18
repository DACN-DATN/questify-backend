import express, { Request, Response } from 'express';
import { requireAuth, ResourcePrefix, requireAdmin } from '@datn242/questify-common';
import { Course } from '../../models/course';
import { User } from '../../models/user';

const router = express.Router();

router.get(
  `${ResourcePrefix.Admin}/courses`,
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response) => {
    const courses = await Course.findAll({
      where: {
        isDeleted: false,
      },
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['deletedAt'],
      },
    });

    const coursesWithTeachers = await Promise.all(
      courses.map(async (course) => {
        const teacher = await User.findByPk(course.teacherId, {
          attributes: ['id', 'userName', 'gmail'],
        });

        return {
          ...course.toJSON(),
          teacher: teacher ? teacher.toJSON() : null,
        };
      }),
    );

    res.status(200).send(coursesWithTeachers);
  },
);

export { router as indexCourseRouter };

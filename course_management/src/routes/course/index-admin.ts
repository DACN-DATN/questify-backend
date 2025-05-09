import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import {
  requireAuth,
  ResourcePrefix,
  CourseStatus,
  UserRole,
  NotAuthorizedError,
} from '@datn242/questify-common';
import { Op } from 'sequelize';

const router = express.Router();

router.get(
  ResourcePrefix.CourseManagement + '/admin',
  requireAuth,
  async (req: Request, res: Response) => {
    if (req.currentUser!.id !== UserRole.Admin) {
      throw new NotAuthorizedError();
    }

    const courses = await Course.findAll({
      where: {
        status: {
            [Op.not]: CourseStatus.Draft,
        },
      },
    });

    res.send(courses);
  },
);

export { router as indexCourseAdminRouter };

import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth, ResourcePrefix } from '@datn242/questify-common';
import { User } from '../../models/user';
import { UserIsland } from '../../models/user-island';
import { UserCourse } from '../../models/user-course';
import { Island } from '../../models/island';
import { Op } from 'sequelize';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/roadmap/courses/:course_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { course_id } = req.params;

    const course = await UserCourse.findByPk(course_id);
    if (!course) {
      throw new BadRequestError('Course not found');
    }

    const student = await User.findByPk(req.currentUser!.id);
    if (!student) {
      throw new BadRequestError('Current student not found');
    }

    const islands = await Island.findAll({
      where: {
        courseId: course.id,
      },
    });
    if (!islands) {
      throw new BadRequestError('Islands not found');
    }
    const islandIds = islands.map((island) => island.id);

    const userIslands = await UserIsland.findAll({
      where: {
        userId: student.id,
        islandId: {
          [Op.in]: islandIds,
        },
      },
    });
    res.send({ userIslands });
  },
);

export { router as showUserIslandRouter };

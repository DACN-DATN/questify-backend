import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth, ResourcePrefix } from '@datn242/questify-common';
import { User } from '../../models/user';
import { UserIsland } from '../../models/user-island';
import { Island } from '../../models/island';
import { Course } from '../../models/course';
import { CompletionStatus } from '@datn242/questify-common';

const router = express.Router();

router.post(
  ResourcePrefix.CourseLearning + '/roadmap/courses/:course_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { course_id } = req.params;

    const course = await Course.findByPk(course_id);
    if (!course) {
      throw new BadRequestError('Course not found');
    }

    const student = await User.findByPk(req.currentUser!.id);
    if (!student) {
      throw new BadRequestError('Current student not found');
    }

    if (student.role !== 'student') {
      throw new BadRequestError('Only student can init user island');
    }

    const islands = await Island.findAll({
      where: {
        courseId: course.id,
      },
    });
    if (!islands) {
      throw new BadRequestError('Islands not found');
    }

    const userIslands: UserIsland[] = [];

    for (const island of islands) {
      const userIsland = UserIsland.build({
        userId: student.id,
        islandId: island.id,
        point: 0,
        completionStatus: CompletionStatus.Locked,
      });
      await userIsland.save();
      userIslands.push(userIsland);
    }

    res.status(201).send({ userIslands });
  },
);

export { router as initUserIslandRouter };

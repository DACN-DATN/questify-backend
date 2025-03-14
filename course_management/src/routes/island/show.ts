import express, { Request, Response } from 'express';
import { NotFoundError } from '@datn242/questify-common';
import { Course } from '../../models/course';
import { Island } from '../../models/island';

const router = express.Router();

router.get(
  '/api/course-mgmt/:course_id/islands/:island_id',
  async (req: Request, res: Response) => {
    const { course_id, island_id } = req.params;
    const course = await Course.findByPk(course_id);

    if (!course) {
      throw new NotFoundError();
    }

    const island = await Island.findOne({
      where: {
        id: island_id,
        courseId: course_id,
      },
    });

    if (!island) {
      throw new NotFoundError();
    }

    res.send(island);
  },
);

export { router as showIslandRouter };

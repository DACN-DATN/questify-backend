import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { User } from '../../models/user';
import { UserCourse } from '../../models/user-course';
import { Inventory } from '../../models/inventory';
import { CourseItemTemplate } from '../../models/course-item-template';
import { InventoryItemTemplate } from '../../models/inventory-item-template';
import { UserCourseCreatedPublisher } from '../../events/publishers/user-course-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

import {
  requireAuth,
  ResourcePrefix,
  NotFoundError,
  BadRequestError,
  CompletionStatus,
} from '@datn242/questify-common';

const router = express.Router();

router.post(
  ResourcePrefix.CourseManagement + '/:course_id/enrollment',
  requireAuth,
  async (req: Request, res: Response) => {
    const courseId = req.params.course_id;

    const course = await Course.findByPk(courseId);

    if (!course) {
      throw new NotFoundError();
    }

    const student = await User.findByPk(req.currentUser!.id);

    if (!student) {
      throw new BadRequestError('Student not found');
    }

    const userCourse = await UserCourse.findOne({
      where: {
        studentId: student.id,
        courseId: course.id,
      },
    });

    if (userCourse) {
      throw new BadRequestError('User already enrolled in this course');
    }

    const enrolledUserCourse = await UserCourse.create({
      studentId: student.id,
      courseId: course.id,
      point: 0,
      completionStatus: CompletionStatus.InProgress,
    });

    const inventory = await Inventory.create({
      user_id: req.currentUser!.id,
      course_id: courseId,
      gold: 200,
    });
    
    const courseItemTemplates = await CourseItemTemplate.findAll({
      where: {
        course_id: courseId,
        isDeleted: false,
      }
    });
    
    for (const courseItemTemplate of courseItemTemplates) {
      await InventoryItemTemplate.create({
        inventory_id: inventory.id,
        item_template_id: courseItemTemplate.item_template_id,
        quantity: 0,
      });
    }

    new UserCourseCreatedPublisher(natsWrapper.client).publish({
      id: enrolledUserCourse.id,
      studentId: enrolledUserCourse.studentId,
      courseId: enrolledUserCourse.courseId,
      point: enrolledUserCourse.point,
      completionStatus: enrolledUserCourse.completionStatus,
    });

    res.status(201).send(enrolledUserCourse);
  },
);

export { router as enrollCourseRouter };

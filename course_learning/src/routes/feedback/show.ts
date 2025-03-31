// import express, { Request, Response } from 'express';
// import {
//   BadRequestError,
//   requireAuth,
//   validateRequest,
//   ResourcePrefix,
// } from '@datn242/questify-common';
// import { query } from 'express-validator';
// import { User } from '../../models/user';
// import { Feedback } from '../../models/feedback';
// import { Course } from '../../models/course';
// import { Island } from '../../models/island';
// import { Level } from '../../models/level';

// const router = express.Router();

// router.get(
//   ResourcePrefix.CourseLearning + '/feedback',
//   requireAuth,
//   [
//     query('student-id')
//       .exists()
//       .withMessage('student-id is required')
//       .isUUID()
//       .withMessage('student-id must be a valid UUID'),
//     query('course-id').optional().isUUID().withMessage('student-id must be a valid UUID'),
//     query('island-id').optional().isUUID().withMessage('student-id must be a valid UUID'),
//     query('level-id').optional().isUUID().withMessage('student-id must be a valid UUID'),
//   ],
//   validateRequest,
//   async (req: Request, res: Response) => {
//     const student_id = req.query['student-id'] as string;
//     const course_id = req.query['course-id'] as string | undefined;
//     const island_id = req.query['island-id'] as string | undefined;
//     const level_id = req.query['level-id'] as string | undefined;

//     if (!student_id) {
//       throw new BadRequestError('Student ID is required.');
//     }

//     const student = await User.findByPk(student_id);

//     if (!student) {
//       throw new BadRequestError('Student not found');
//     }

//     if (level_id) {
//       return await getLevelFeedback(student, level_id, req, res);
//     } else if (island_id) {
//       return await getIslandFeedback(student, island_id, req, res);
//     } else if (course_id) {
//       return await getCourseFeedback(student, course_id, req, res);
//     } else {
//       throw new BadRequestError('At least one of course-id, island-id, or level-id is required');
//     }

//     res.send();
//   },
// );

// const getLevelFeedback = async (
//   student: User,
//   level_id: string,
//   req: Request,
//   res: Response,
// ) => {
//   const level = await Level.findByPk(level_id);
//   if (!level) {
//     throw new BadRequestError('Level not found');
//   }

//   const feedbacks = await Feedback.findAll({
//     where: {
//       studentId: student.id,
//       levelId: level.id,
//     },
//   });

//   res.send({ feedbacks });
// };

// const getIslandFeedback = async (
//   student: User,
//   island_id: string,
//   req: Request,
//   res: Response,
// ) => {};

// const getCourseFeedback = async (
//   student: User,
//   course_id: string,
//   req: Request,
//   res: Response,
// ) => {};

// export { router as showHintRouter };

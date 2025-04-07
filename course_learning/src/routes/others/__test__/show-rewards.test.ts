import request from 'supertest';
import { app } from '../../../app';
import { User } from '../../../models/user';
import { Reward } from '../../../models/reward';
import { Course } from '../../../models/course';
import { UserReward } from '../../../models/user-reward';
import {
  RequestValidationError,
  UserRole,
  ResourcePrefix,
  BadRequestError,
  NotFoundError,
} from '@datn242/questify-common';

import { v4 as uuidv4 } from 'uuid';
import e from 'express';

const resource = ResourcePrefix.CourseLearning + '/students';

it(`return ${RequestValidationError.statusCode} if the param input is invalid`, async () => {
  const cookie = await global.getAuthCookie();

  await request(app)
    .get(resource + '/123/rewards')
    .set('Cookie', cookie)
    .expect(RequestValidationError.statusCode)
    .expect((res) => {
      expect(res.text).toContain('Error: Invalid request parameters');
    });
});

it.skip(`return ${NotFoundError.statusCode} if the user not found`, async () => {
  const cookie = await global.getAuthCookie();
  const fakeUserId = uuidv4();

  await request(app)
    .get(resource + '/' + fakeUserId + '/rewards')
    .set('Cookie', cookie)
    .expect(NotFoundError.statusCode);
});

it.only('returns rewards if the rewards is found', async () => {
  const cookie = await global.getAuthCookie();
  const student = User.build({
    gmail: 'student@test.com',
    role: UserRole.Student,
    userName: 'test_student',
  });
  await student.save();

  const teacher = User.build({
    gmail: 'teacher@test.com',
    role: UserRole.Teacher,
    userName: 'test_teacher',
  });
  await teacher.save();

  const course = Course.build({
    name: 'test_course',
    teacherId: teacher.id,
  });
  await course.save();

  const reward = Reward.build({
    description: 'test_reward',
    rewardTarget: 'course',
    courseId: course.id,
  });
  await reward.save();

  await student.addReward(reward);
  await reward.addUser(student);

  const userReward = await UserReward.findAll();

  console.log('userReward', userReward);

  await request(app)
    .get(resource + '/' + student.id + '/rewards')
    .set('Cookie', cookie)
    .expect(200)
    .expect((res) => {
      expect(res.body[0].description).toEqual('test_reward');
      expect(res.body[0].rewardTarget).toEqual('course');
      expect(res.body[0].courseId).toEqual(course.id);
    });
});

import request from 'supertest';
import { app } from '../../../app';
import { Feedback } from '../../../models/feedback';
import {
  NotAuthorizedError,
  RequestValidationError,
  NotFoundError,
  ResourcePrefix,
  UserRole,
} from '@datn242/questify-common';
import { User } from '../../../models/user';
import { Course } from '../../../models/course';
import { Island } from '../../../models/island';
import { Level } from '../../../models/level';
import { Challenge } from '../../../models/challenge';
import { Minigame } from '../../../models/minigame';
import { Attempt } from '../../../models/attempt';

const resource = ResourcePrefix.CourseLearning + '/quizzes';

it(`has a route handler listening to ${resource + '/:quiz_id'} for post requests`, async () => {
  const response = await request(app)
    .post(resource + '/randomId')
    .send({});

  expect(response.status).not.toEqual(NotFoundError.statusCode);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post(resource + '/randomId')
    .send({})
    .expect(NotAuthorizedError.statusCode);
});

it(`returns a status other than ${NotAuthorizedError.statusCode} if the user is signed in`, async () => {
  const cookie = await global.getAuthCookie();
  const response = await request(app)
    .post(resource + '/randomId')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

describe('Already have course, island, and level', () => {
  let level: Level = undefined!;
  let course: Course = undefined!;
  let cookie: string[] = undefined!;
  let student: User = undefined!;

  beforeEach(async () => {
    const studentGmail = `student@test.com`;
    cookie = await global.getAuthCookie(studentGmail, UserRole.Student);
    student = (await User.findOne({
      where: {
        gmail: studentGmail,
      },
    }))!;
    const teacher = User.build({
      gmail: 'teacher@test.com',
      role: UserRole.Teacher,
      userName: 'test_teacher',
    });
    await teacher.save();

    course = Course.build({
      name: 'test_course',
      teacherId: teacher.id,
    });
    await course.save();

    const island = Island.build({
      name: 'test_island',
      position: 1,
      courseId: course.id,
    });
    await island.save();

    level = Level.build({
      name: 'test_level',
      position: 1,
      islandId: island.id,
    });
    await level.save();
  });

  it('update a quiz submission with valid inputs', async () => {
    const challenge = Challenge.build({
      description: 'test_description',
      levelId: level.id,
    });
    await challenge.save();

    const quiz = Minigame.build({
      challengeId: challenge.id,
      type: 'quiz',
      position: 1,
    });
    await quiz.save();

    await student.addLevel(level);
    await level.addUser(student);

    const response = await request(app)
      .post(resource + `/${quiz.id}`)
      .set('Cookie', cookie)
      .send({
        challenge_id: challenge.id,
      })
      .expect(200);
  });
});

import request from 'supertest';
import { app } from '../../../app';
import { NotAuthorizedError, BadRequestError, ResourcePrefix } from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';
import { Testcase } from '../../../models/testcase';

it('can only be accessed if the user is signed in', async () => {
  const code_problem_id = uuidv4();
  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem_id}/testcases`)
    .send({})
    .expect(NotAuthorizedError.statusCode);
});

it(`returns a status other than ${NotAuthorizedError.statusCode} if the user is signed in`, async () => {
  const cookie = await global.getAuthCookie();
  const code_problem_id = uuidv4();
  const response = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem_id}/testcases`)
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

it('return BadRequestError if code problem not found', async () => {
  const cookie = await global.getAuthCookie();
  const code_problem_id = uuidv4();
  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem_id}/testcases`)
    .set('Cookie', cookie)
    .send({
      testcases: [
        {
          input: [1],
          output: [2],
          isShowed: true,
        },
      ],
    })
    .expect(BadRequestError.statusCode);
});

it('returns an error if an invalid testcases is provided', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const code_problem = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      description: 'Test Description',
    })
    .expect(201);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send({
      testcases: [],
    })
    .expect(BadRequestError.statusCode);
});

it('creates an testcase with valid inputs', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const code_problem = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      description: 'Test Description',
    })
    .expect(201);

  let testcases = await Testcase.findAll();
  expect(testcases.length).toEqual(0);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send({
      testcases: [
        {
          input: [1],
          output: [2],
          isShowed: true,
        },
        {
          input: ['0'],
          output: ['1'],
          isShowed: false,
        },
      ],
    })
    .expect(201);

  testcases = await Testcase.findAll();
  expect(testcases.length).toEqual(2);
  expect(testcases[0].input).toEqual([1]);
  expect(testcases[0].output).toEqual([2]);
  expect(testcases[0].isShowed).toEqual(true);
  expect(testcases[1].input).toEqual(['0']);
  expect(testcases[1].output).toEqual(['1']);
  expect(testcases[1].isShowed).toEqual(false);
});

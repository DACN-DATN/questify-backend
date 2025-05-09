import request from 'supertest';
import { app } from '../../../app';
import { CodeProblem } from '../../../models/code-problem';
import { Testcase } from '../../../models/testcase';
import {
  NotAuthorizedError,
  BadRequestError,
  ResourcePrefix,
  RequestValidationError,
} from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';
import {
  twoSum,
  jumpGame,
  validParentheses,
  searchA2DMatrix,
} from '../../../mock-data/assessment.mock';

it('assess Two sum problem with valid input', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const code_problem = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      description: 'Test Description',
      starterCode: 'function test() {}',
    })
    .expect(201);

  let testcases = await Testcase.findAll();
  expect(testcases.length).toEqual(0);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send(twoSum.mockTestcase)
    .expect(201);

  const assessmentResponse = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/assessment`)
    .set('Cookie', cookie)
    .send({
      userCode: twoSum.mockUserCode,
    })
    .expect(200);

  expect(assessmentResponse.body.success).toBe(true);
  expect(assessmentResponse.body.totalTestcases).toBe(3);
  expect(assessmentResponse.body.passedTestcases).toBe(3);
});

it('assess Jump Game problem with valid input', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const code_problem = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      description: 'Test Description',
      starterCode: 'function test() {}',
    })
    .expect(201);

  let testcases = await Testcase.findAll();
  expect(testcases.length).toEqual(0);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send(jumpGame.mockTestcase)
    .expect(201);

  const assessmentResponse = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/assessment`)
    .set('Cookie', cookie)
    .send({
      userCode: jumpGame.mockUserCode,
    })
    .expect(200);

  expect(assessmentResponse.body.success).toBe(true);
  expect(assessmentResponse.body.totalTestcases).toBe(2);
  expect(assessmentResponse.body.passedTestcases).toBe(2);
});

it('assess Valid Parenthesis problem with valid input', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const code_problem = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      description: 'Test Description',
      starterCode: 'function test() {}',
    })
    .expect(201);

  let testcases = await Testcase.findAll();
  expect(testcases.length).toEqual(0);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send(validParentheses.mockTestcase)
    .expect(201);

  const assessmentResponse = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/assessment`)
    .set('Cookie', cookie)
    .send({
      userCode: validParentheses.mockUserCode,
    })
    .expect(200);

  expect(assessmentResponse.body.success).toBe(true);
  expect(assessmentResponse.body.totalTestcases).toBe(9);
  expect(assessmentResponse.body.passedTestcases).toBe(9);
});

it('assess Search a 2D Matrx problem with valid input', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const code_problem = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      description: 'Test Description',
      starterCode: 'function test() {}',
    })
    .expect(201);

  let testcases = await Testcase.findAll();
  expect(testcases.length).toEqual(0);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send(searchA2DMatrix.mockTestcase)
    .expect(201);

  const assessmentResponse = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/assessment`)
    .set('Cookie', cookie)
    .send({
      userCode: searchA2DMatrix.mockUserCode,
    })
    .expect(200);

  expect(assessmentResponse.body.success).toBe(true);
  expect(assessmentResponse.body.totalTestcases).toBe(3);
  expect(assessmentResponse.body.passedTestcases).toBe(3);
});

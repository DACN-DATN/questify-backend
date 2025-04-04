import request from 'supertest';
import { app } from '../../../app';
import { CodeProblem } from '../../../models/code-problem';
import { NotAuthorizedError, BadRequestError, ResourcePrefix } from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post(ResourcePrefix.CodeProblem)
    .send({})
    .expect(NotAuthorizedError.statusCode);
});

it(`returns a status other than ${NotAuthorizedError.statusCode} if the user is signed in`, async () => {
  const cookie = await global.getAuthCookie();
  const response = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

it('return BadRequestError if level not found', async () => {
  const cookie = await global.getAuthCookie();
  const level_id = uuidv4();
  await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level_id,
      description: 'Test description',
    })
    .expect(BadRequestError.statusCode);
});

it('returns an error if an invalid description is provided', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      description: 1,
    })
    .expect(BadRequestError.statusCode);

  await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      description: true,
    })
    .expect(BadRequestError.statusCode);
});

it('creates an Island with valid inputs', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);
  let code_problems = await CodeProblem.findAll();
  expect(code_problems.length).toEqual(0);

  await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      description: 'Test description',
    })
    .expect(201);

  code_problems = await CodeProblem.findAll();
  expect(code_problems.length).toEqual(1);
  expect(code_problems[0].levelId).toEqual(level.id);
  expect(code_problems[0].description).toEqual('Test description');
});

import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, NotAuthorizedError, ResourcePrefix } from '@datn242/questify-common';

it('returns a NotAuthorizedError if the user is not signin', async () => {
  const code_problem_id = uuidv4();
  const testcase_id = uuidv4();
  await request(app)
    .delete(`${ResourcePrefix.CodeProblem}/${code_problem_id}/testcases/${testcase_id}`)
    .send()
    .expect(NotAuthorizedError.statusCode);
});

it('returns a NotFoundError if the provided testcase does not exist', async () => {
  const cookie = await global.getAuthCookie();
  const code_problem_id = uuidv4();
  const testcase_id = uuidv4();

  await request(app)
    .delete(`${ResourcePrefix.CodeProblem}/${code_problem_id}/testcases/${testcase_id}`)
    .set('Cookie', cookie)
    .send()
    .expect(NotFoundError.statusCode);
});

it('returns a NotAuthorizedError if the user does not own the code problem', async () => {
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

  const testcases = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send({
      testcases: [
        {
          input: '1',
          output: '2',
          isShowed: true,
        },
      ],
    })
    .expect(201);

  const cookie2 = await global.getAuthCookie(undefined, 'test2@gmail.com');
  await request(app)
    .delete(
      `${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases/${testcases.body[0].id}`,
    )
    .set('Cookie', cookie2)
    .send()
    .expect(NotAuthorizedError.statusCode);
});

it('delete successfully', async () => {
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

  const testcases = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send({
      testcases: [
        {
          input: '1',
          output: '2',
          isShowed: true,
        },
      ],
    })
    .expect(201);

  const response = await request(app)
    .delete(
      `${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases/${testcases.body[0].id}`,
    )
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.message).toEqual('Delete successfully');

  await request(app)
    .get(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases/${testcases.body[0].id}`)
    .set('Cookie', cookie)
    .send()
    .expect(NotFoundError.statusCode);
});

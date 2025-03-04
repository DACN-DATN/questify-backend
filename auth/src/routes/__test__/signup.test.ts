import request from 'supertest';
import { app } from '../../app';
import { UserRole } from '@datn242/questify-common';

it('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      userName: 'test_student',
      email: 'test.student@test.com',
      password: 'password',
      role: UserRole.Student,
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      userName: 'test_teacher',
      email: 'test.teacher@test.com',
      password: 'password',
      role: UserRole.Teacher,
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      userName: 'test',
      email: 'test.com',
      password: 'password',
      role: UserRole.Student,
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      userName: 'test',
      email: 'test@test.com',
      password: 'p',
      role: UserRole.Student,
    })
    .expect(400);
});

it('returns a 400 with an invalid userName', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      userName: 't',
      email: 'test@test.com',
      password: 'password',
      role: UserRole.Student,
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
      role: UserRole.Student,
    })
    .expect(400);
});

it('returns a 400 with an invalid role', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      userName: 'test',
      email: 'test@test.com',
      password: 'password',
      role: UserRole.Admin,
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      userName: 'test',
      password: 'password',
      role: UserRole.Student,
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      userName: 'test',
      email: 'test@test.com',
      role: UserRole.Student,
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      userName: 'test',
      email: 'test@test.com',
      password: 'password',
      role: UserRole.Student,
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      userName: 'test',
      email: 'test@test.com',
      password: 'password',
      role: UserRole.Student,
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      userName: 'test',
      email: 'test@test.com',
      password: 'password',
      role: UserRole.Student,
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});

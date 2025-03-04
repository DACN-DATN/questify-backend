import request from 'supertest';
import { app } from '../../app';
import { UserRole } from '@datn242/questify-common';

it('clears the cookie after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      userName: 'test',
      email: 'test@test.com',
      password: 'password',
      role: UserRole.Student,
    })
    .expect(201);

  const response = await request(app).post('/api/users/signout').send({}).expect(200);

  const cookie = response.get('Set-Cookie');
  if (!cookie) {
    throw new Error('Expected cookie but got undefined.');
  }

  expect(cookie[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
});

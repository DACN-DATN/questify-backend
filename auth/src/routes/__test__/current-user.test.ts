import request from 'supertest';
import { app } from '../../app';

const signUp = async () => {
  const firstResponse = await request(app)
    .post('/api/users/validate-credentials')
    .send({
      userName: 'test',
      email: 'test@datn242.com',
    })
    .expect(200);

  const cookies = firstResponse.get('Set-Cookie');

  return await request(app)
    .post('/api/users/complete-signup')
    .set('Cookie', cookies || [])
    .send({
      password: 'password',
      confirmedPassword: 'password',
    })
    .expect(201);
};

// supertest by default does not manage cookies, so we need to manually manage them

it('responds with details about the current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app).get('/api/users/currentuser').send({}).expect(200);

  expect(response.body.currentUser).toEqual(null);
});

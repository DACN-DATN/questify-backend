import request from 'supertest';
import { app } from '../../../app';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  RequestValidationError,
  NotFoundError,
  NotAuthorizedError,
} from '@datn242/questify-common';

it('returns a 404 if the provided id does not exist', async () => {
  const course_id = uuidv4();
  const cookie = await global.getAuthCookie();
  await request(app)
    .put(`/api/course-mgmt/${course_id}`)
    .set('Cookie', cookie)
    .send({
      name: 'dsa',
    })
    .expect(NotFoundError.statusCode);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/course-mgmt/${id}`)
    .send({
      title: 'aslkdfj',
      price: 20,
    })
    .expect(NotAuthorizedError.statusCode);
});

it('returns a 401 if the user does not own the course', async () => {
  const cookie1 = await global.getAuthCookie('test1@gmail.com');
  const response = await request(app).post('/api/course-mgmt').set('Cookie', cookie1).send({
    name: 'DSA',
  });
  const cookie2 = await global.getAuthCookie('test2@gmail.com');
  await request(app)
    .put(`/api/course-mgmt/${response.body.id}`)
    .set('Cookie', cookie2)
    .send({
      name: 'Computer Architecture',
    })
    .expect(NotAuthorizedError.statusCode);
});

it('returns a RequestValidationError if the user provides an invalid name', async () => {
  const cookie = await global.getAuthCookie();

  const response = await request(app).post('/api/course-mgmt').set('Cookie', cookie).send({
    name: 'DSA',
  });

  await request(app)
    .put(`/api/course-mgmt/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: '',
    })
    .expect(RequestValidationError.statusCode);

  await request(app)
    .put(`/api/course-mgmt/${response.body.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(RequestValidationError.statusCode);
});

it('updates the course provided valid inputs', async () => {
  const cookie = await global.getAuthCookie();
  const response = await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({
      name: 'DSA',
    })
    .expect(201);

  await request(app)
    .put(`/api/course-mgmt/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'Computer Architecture',
    })
    .expect(200);

  const courseResponse = await request(app).get(`/api/course-mgmt/${response.body.id}`).send();

  expect(courseResponse.body.name).toEqual('Computer Architecture');
});

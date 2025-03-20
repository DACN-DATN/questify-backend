import request from 'supertest';
import { app } from '../../../app';
import { Course } from '../../../models/course';
import {
  NotAuthorizedError,
  RequestValidationError,
  NotFoundError,
} from '@datn242/questify-common';

it('has a route handler listening to /api/course-mgmt for post requests', async () => {
  const response = await request(app).post('/api/course-mgmt').send({});

  expect(response.status).not.toEqual(NotFoundError.statusCode);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/course-mgmt').send({}).expect(NotAuthorizedError.statusCode);
});

it(`returns a status other than ${NotAuthorizedError.statusCode} if the user is signed in`, async () => {
  const cookie = await global.signin();
  const response = await request(app).post('/api/course-mgmt').set('Cookie', cookie).send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

// it('returns an error if an invalid name is provided', async () => {
//   const cookie = await global.signin();
//   await request(app)
//     .post('/api/course-mgmt')
//     .set('Cookie', cookie)
//     .send({
//       title: '',
//       price: 10,
//     })
//     .expect(RequestValidationError.statusCode);

//   const cookie2 = await global.signin();
//   await request(app)
//     .post('/api/course-mgmt')
//     .set('Cookie', cookie2)
//     .send({
//       price: 10,
//     })
//     .expect(RequestValidationError.statusCode);
// });

// it('returns an error if an invalid price is provided', async () => {
//   const cookie = await global.signin();
//   await request(app)
//     .post('/api/course-mgmt')
//     .set('Cookie', cookie)
//     .send({
//       title: 'asldkjf',
//       price: -10,
//     })
//     .expect(RequestValidationError.statusCode);

//   const cookie2 = await global.signin();
//   await request(app)
//     .post('/api/course-mgmt')
//     .set('Cookie', cookie2)
//     .send({
//       title: 'laskdfj',
//     })
//     .expect(RequestValidationError.statusCode);
// });

it('creates a Course with valid inputs', async () => {
  const cookie = await global.signin();
  let Courses = await Course.findAll();
  expect(Courses.length).toEqual(0);

  // const name = 'DSA';
  // const uploadDate = new Date().toISOString();

  await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({
      name: 'DSA',
      uploadDate: new Date(),
    })
    .expect(201);

  Courses = await Course.findAll();
  expect(Courses.length).toEqual(1);
  // expect(Courses[0].price).toEqual(20);
  // expect(Courses[0].title).toEqual(title);
});

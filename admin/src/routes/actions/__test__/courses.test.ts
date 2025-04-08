import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotAuthorizedError, UserRole } from '@datn242/questify-common';
import { AdminCourseActionType } from '../../../models/admin-course';

const BASE_URL = '/api/admin/actions/courses';

describe('List Admin Course Actions API', () => {
  it('returns NotAuthorizedError if the user is not signed in', async () => {
    await request(app).get(BASE_URL).send().expect(NotAuthorizedError.statusCode);
  });

  it('returns NotAuthorizedError if the user is not an admin', async () => {
    const cookie = await global.getAuthCookie(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    await request(app)
      .get(BASE_URL)
      .set('Cookie', cookie)
      .send()
      .expect(NotAuthorizedError.statusCode);
  });

  it('returns an empty array when no actions exist', async () => {
    const cookie = await global.getAuthCookie();

    const response = await request(app).get(BASE_URL).set('Cookie', cookie).send().expect(200);

    expect(response.body.length).toEqual(0);
  });

  it('returns a list of all admin actions on courses', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    // Create a teacher for the courses
    const teacher = await global.createUser(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    // Create some courses
    const course1 = await global.createCourse(teacher.id, 'Course 1', 'Description 1');

    const course2 = await global.createCourse(teacher.id, 'Course 2', 'Description 2');

    // Create admin actions
    await global.createAdminCourseAction(
      adminId,
      course1.id,
      AdminCourseActionType.Approve,
      'Meets quality standards',
    );

    await global.createAdminCourseAction(
      adminId,
      course2.id,
      AdminCourseActionType.Reject,
      'Does not meet requirements',
    );

    const response = await request(app).get(BASE_URL).set('Cookie', adminCookie).send().expect(200);

    expect(response.body.length).toEqual(2);

    // Verify both action types are present
    const actionTypes = response.body.map((action: any) => action.actionType);
    expect(actionTypes).toContain(AdminCourseActionType.Approve);
    expect(actionTypes).toContain(AdminCourseActionType.Reject);

    // Check relationships are included
    expect(response.body[0].admin).toBeDefined();
    expect(response.body[0].course).toBeDefined();
    expect(response.body[0].course.name).toBeDefined();
  });

  it('supports filtering by course ID', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    // Create a teacher
    const teacher = await global.createUser(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    // Create some courses
    const course1 = await global.createCourse(teacher.id, 'Course 1');
    const course2 = await global.createCourse(teacher.id, 'Course 2');

    // Create admin actions
    await global.createAdminCourseAction(adminId, course1.id);
    await global.createAdminCourseAction(adminId, course2.id);

    const response = await request(app)
      .get(`${BASE_URL}?courseId=${course1.id}`)
      .set('Cookie', adminCookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(1);
    expect(response.body[0].courseId).toEqual(course1.id);
  });

  it('supports filtering by action type', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    // Create a teacher
    const teacher = await global.createUser(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    // Create a course
    const course = await global.createCourse(teacher.id);

    // Create admin actions with different types
    await global.createAdminCourseAction(
      adminId,
      course.id,
      AdminCourseActionType.Approve,
      'Meets standards',
    );

    await global.createAdminCourseAction(
      adminId,
      course.id,
      AdminCourseActionType.Reject,
      'Does not meet standards',
    );

    const response = await request(app)
      .get(`${BASE_URL}?actionType=${AdminCourseActionType.Approve}`)
      .set('Cookie', adminCookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(1);
    expect(response.body[0].actionType).toEqual(AdminCourseActionType.Approve);
  });

  it('returns actions sorted by creation date (newest first)', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    // Create a teacher
    const teacher = await global.createUser(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    // Create a course
    const course = await global.createCourse(teacher.id);

    // Create admin actions with different dates
    // First action (older)
    const firstAction = await global.createAdminCourseAction(adminId, course.id);

    // Wait 100ms to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Second action (newer)
    const secondAction = await global.createAdminCourseAction(adminId, course.id);

    const response = await request(app).get(BASE_URL).set('Cookie', adminCookie).send().expect(200);

    expect(response.body.length).toEqual(2);

    // The newest action should be first
    expect(response.body[0].id).toEqual(secondAction.id);
    expect(response.body[1].id).toEqual(firstAction.id);
  });
});

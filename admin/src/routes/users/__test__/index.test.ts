import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotAuthorizedError,  UserRole, UserStatus } from '@datn242/questify-common';

const BASE_URL = '/api/admin/users';

describe('List All Users API', () => {
  it('returns NotAuthorizedError if the user is not signed in', async () => {
    await request(app)
      .get(BASE_URL)
      .send()
      .expect(NotAuthorizedError.statusCode);
  });

  it('returns NotAuthorizedError if the user is not an admin', async () => {
    const cookie = await global.getAuthCookie(
      undefined, 
      'teacher@test.com', 
      'teacher', 
      UserRole.Teacher
    );

    await request(app)
      .get(BASE_URL)
      .set('Cookie', cookie)
      .send()
      .expect(NotAuthorizedError.statusCode);
  });

  it('returns an empty array when no users exist', async () => {
    const cookie = await global.getAuthCookie();

    const response = await request(app)
      .get(BASE_URL)
      .set('Cookie', cookie)
      .send()
      .expect(200);

    // Should return at least the admin user
    expect(response.body.length).toEqual(1);
    expect(response.body[0].role).toEqual(UserRole.Admin);
  });

  it('returns a list of all users', async () => {
    const adminCookie = await global.getAuthCookie();
    
    // Create three additional users
    await global.createUser(
      undefined, 
      'student1@test.com', 
      'student1', 
      UserRole.Student
    );
    
    await global.createUser(
      undefined, 
      'student2@test.com', 
      'student2', 
      UserRole.Student,
      UserStatus.Suspended
    );
    
    await global.createUser(
      undefined, 
      'teacher@test.com', 
      'teacher', 
      UserRole.Teacher
    );

    const response = await request(app)
      .get(BASE_URL)
      .set('Cookie', adminCookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(4);
    
    // Verify we have users with different roles
    const roles = response.body.map((user: any) => user.role);
    expect(roles).toContain(UserRole.Admin);
    expect(roles).toContain(UserRole.Student);
    expect(roles).toContain(UserRole.Teacher);
    
    // Verify we have users with different statuses
    const statuses = response.body.map((user: any) => user.status);
    expect(statuses).toContain(UserStatus.Active);
    expect(statuses).toContain(UserStatus.Suspended);
  });
});
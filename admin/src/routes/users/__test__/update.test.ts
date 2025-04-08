import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { 
  NotAuthorizedError, 
  NotFoundError, 
  RequestValidationError, 
  UserRole, 
  UserStatus 
} from '@datn242/questify-common';
import { AdminActionType } from '../../../models/admin-user';

const BASE_URL = '/api/admin/users';

describe('Update User Status API', () => {
  it('returns NotAuthorizedError if the user is not signed in', async () => {
    const userId = uuidv4();

    await request(app)
      .patch(`${BASE_URL}/${userId}`)
      .send({
        status: UserStatus.Suspended,
        reason: 'Violation of terms'
      })
      .expect(NotAuthorizedError.statusCode);
  });

  it('returns NotAuthorizedError if the user is not an admin', async () => {
    const userId = uuidv4();
    const cookie = await global.getAuthCookie(
      undefined, 
      'teacher@test.com', 
      'teacher', 
      UserRole.Teacher
    );

    await request(app)
      .patch(`${BASE_URL}/${userId}`)
      .set('Cookie', cookie)
      .send({
        status: UserStatus.Suspended,
        reason: 'Violation of terms'
      })
      .expect(NotAuthorizedError.statusCode);
  });

  it('returns NotFoundError if the user does not exist', async () => {
    const adminCookie = await global.getAuthCookie();
    const nonExistentUserId = uuidv4();

    await request(app)
      .patch(`${BASE_URL}/${nonExistentUserId}`)
      .set('Cookie', adminCookie)
      .send({
        status: UserStatus.Suspended,
        reason: 'Violation of terms'
      })
      .expect(NotFoundError.statusCode);
  });

  it('returns RequestValidationError if the status is invalid', async () => {
    const adminCookie = await global.getAuthCookie();
    
    // Create a user to update
    const testUser = await global.createUser();

    await request(app)
      .patch(`${BASE_URL}/${testUser.id}`)
      .set('Cookie', adminCookie)
      .send({
        status: 'invalid-status',
        reason: 'Violation of terms'
      })
      .expect(RequestValidationError.statusCode);
  });

  it('returns RequestValidationError if no reason is provided for suspension', async () => {
    const adminCookie = await global.getAuthCookie();
    
    // Create a user to update
    const testUser = await global.createUser();

    await request(app)
      .patch(`${BASE_URL}/${testUser.id}`)
      .set('Cookie', adminCookie)
      .send({
        status: UserStatus.Suspended
      })
      .expect(RequestValidationError.statusCode);
  });

  it('successfully suspends a user', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);
    
    // Create a user to suspend
    const testUser = await global.createUser();
    expect(testUser.status).toEqual(UserStatus.Active);

    const response = await request(app)
      .patch(`${BASE_URL}/${testUser.id}`)
      .set('Cookie', adminCookie)
      .send({
        status: UserStatus.Suspended,
        reason: 'Violation of terms'
      })
      .expect(200);

    // Verify user status is updated
    expect(response.body.id).toEqual(testUser.id);
    expect(response.body.status).toEqual(UserStatus.Suspended);
    
    // Verify admin action is recorded
    const { adminAction } = response.body;
    expect(adminAction).toBeDefined();
    expect(adminAction.adminId).toEqual(adminId);
    expect(adminAction.userId).toEqual(testUser.id);
    expect(adminAction.actionType).toEqual(AdminActionType.Suspend);
    expect(adminAction.reason).toEqual('Violation of terms');
  });

  it('successfully reactivates a suspended user', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);
    
    // Create a suspended user
    const testUser = await global.createUser(
      undefined,
      'suspended@test.com',
      'suspended',
      UserRole.Student,
      UserStatus.Suspended
    );
    expect(testUser.status).toEqual(UserStatus.Suspended);

    const response = await request(app)
      .patch(`${BASE_URL}/${testUser.id}`)
      .set('Cookie', adminCookie)
      .send({
        status: UserStatus.Active,
        reason: 'User appeal approved'
      })
      .expect(200);

    // Verify user status is updated
    expect(response.body.id).toEqual(testUser.id);
    expect(response.body.status).toEqual(UserStatus.Active);
  });

  it('prevents an admin from suspending themselves', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    await request(app)
      .patch(`${BASE_URL}/${adminId}`)
      .set('Cookie', adminCookie)
      .send({
        status: UserStatus.Suspended,
        reason: 'Self-suspension test'
      })
      .expect(400); // Bad request
  });
});
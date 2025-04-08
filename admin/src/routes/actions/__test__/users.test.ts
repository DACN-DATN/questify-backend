import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotAuthorizedError, UserRole, UserStatus } from '@datn242/questify-common';
import { AdminActionType } from '../../../models/admin-user';

const BASE_URL = '/api/admin/actions/users';

describe('List Admin User Actions API', () => {
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

  it('returns a list of all admin actions on users', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    // Create some users to suspend
    const user1 = await global.createUser(undefined, 'user1@test.com', 'user1');

    const user2 = await global.createUser(undefined, 'user2@test.com', 'user2');

    // Create admin actions
    await global.createAdminUserAction(
      adminId,
      user1.id,
      AdminActionType.Suspend,
      'Violation of terms',
    );

    await global.createAdminUserAction(
      adminId,
      user2.id,
      AdminActionType.Suspend,
      'Inappropriate content',
    );

    const response = await request(app).get(BASE_URL).set('Cookie', adminCookie).send().expect(200);

    expect(response.body.length).toEqual(2);

    // Check action details
    expect(response.body[0].adminId).toEqual(adminId);
    expect(response.body[0].actionType).toEqual(AdminActionType.Suspend);

    // Check relationships are included
    expect(response.body[0].admin).toBeDefined();
    expect(response.body[0].targetUser).toBeDefined();
    expect(response.body[0].targetUser.id).toBeDefined();
  });

  it('supports filtering by user ID', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    // Create some users
    const user1 = await global.createUser(undefined, 'user1@test.com', 'user1');
    const user2 = await global.createUser(undefined, 'user2@test.com', 'user2');

    // Create admin actions
    await global.createAdminUserAction(adminId, user1.id);
    await global.createAdminUserAction(adminId, user2.id);

    const response = await request(app)
      .get(`${BASE_URL}?userId=${user1.id}`)
      .set('Cookie', adminCookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(1);
    expect(response.body[0].userId).toEqual(user1.id);
  });

  it('supports filtering by action type', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    // Create a user
    const user = await global.createUser();

    // Create admin actions
    await global.createAdminUserAction(adminId, user.id, AdminActionType.Suspend, 'Test reason');

    const response = await request(app)
      .get(`${BASE_URL}?actionType=${AdminActionType.Suspend}`)
      .set('Cookie', adminCookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(1);
    expect(response.body[0].actionType).toEqual(AdminActionType.Suspend);
  });

  it('returns actions sorted by creation date (newest first)', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    // Create a user
    const user = await global.createUser();

    // Create admin actions with different dates
    // First action (older)
    const firstAction = await global.createAdminUserAction(adminId, user.id);

    // Wait 100ms to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Second action (newer)
    const secondAction = await global.createAdminUserAction(adminId, user.id);

    const response = await request(app).get(BASE_URL).set('Cookie', adminCookie).send().expect(200);

    expect(response.body.length).toEqual(2);

    // The newest action should be first
    expect(response.body[0].id).toEqual(secondAction.id);
    expect(response.body[1].id).toEqual(firstAction.id);
  });
});

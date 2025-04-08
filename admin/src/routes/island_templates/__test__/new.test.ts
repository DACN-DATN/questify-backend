import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotAuthorizedError, RequestValidationError, UserRole } from '@datn242/questify-common';
import { AdminIslandTemplateActionType } from '../../../models/admin-island-template';

const BASE_URL = '/api/admin/island-templates';

describe('Create Island Template API', () => {
  it('returns NotAuthorizedError if the user is not signed in', async () => {
    await request(app)
      .post(BASE_URL)
      .send({
        name: 'Test Template',
        imageUrl: 'https://example.com/image.png',
      })
      .expect(NotAuthorizedError.statusCode);
  });

  it('returns NotAuthorizedError if the user is not an admin', async () => {
    const cookie = await global.getAuthCookie(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    await request(app)
      .post(BASE_URL)
      .set('Cookie', cookie)
      .send({
        name: 'Test Template',
        imageUrl: 'https://example.com/image.png',
      })
      .expect(NotAuthorizedError.statusCode);
  });

  it('returns RequestValidationError if the name is missing', async () => {
    const adminCookie = await global.getAuthCookie();

    await request(app)
      .post(BASE_URL)
      .set('Cookie', adminCookie)
      .send({
        imageUrl: 'https://example.com/image.png',
      })
      .expect(RequestValidationError.statusCode);
  });

  it('returns RequestValidationError if the imageUrl is missing', async () => {
    const adminCookie = await global.getAuthCookie();

    await request(app)
      .post(BASE_URL)
      .set('Cookie', adminCookie)
      .send({
        name: 'Test Template',
      })
      .expect(RequestValidationError.statusCode);
  });

  it('successfully creates an island template', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    const templateName = 'Forest Island';
    const templateImage = 'https://example.com/forest-island.png';

    const response = await request(app)
      .post(BASE_URL)
      .set('Cookie', adminCookie)
      .send({
        name: templateName,
        imageUrl: templateImage,
      })
      .expect(201);

    // Verify template is created with correct data
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toEqual(templateName);
    expect(response.body.imageUrl).toEqual(templateImage);
    expect(response.body.isDeleted).toEqual(false);

    // Verify admin action is recorded
    const { adminAction } = response.body;
    expect(adminAction).toBeDefined();
    expect(adminAction.adminId).toEqual(adminId);
    expect(adminAction.islandTemplateId).toEqual(response.body.id);
    expect(adminAction.actionType).toEqual(AdminIslandTemplateActionType.Add);
  });

  it('returns an error if a template with the same name already exists', async () => {
    const adminCookie = await global.getAuthCookie();

    // Create a template first
    await global.createIslandTemplate('Unique Template');

    // Try to create another with the same name
    await request(app)
      .post(BASE_URL)
      .set('Cookie', adminCookie)
      .send({
        name: 'Unique Template',
        imageUrl: 'https://example.com/another-image.png',
      })
      .expect(400); // Bad request
  });
});

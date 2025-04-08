import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotAuthorizedError, UserRole } from '@datn242/questify-common';

const BASE_URL = '/api/admin/island-templates';

describe('List Island Templates API', () => {
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

  it('returns an empty array when no templates exist', async () => {
    const cookie = await global.getAuthCookie();

    const response = await request(app)
      .get(BASE_URL)
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(0);
  });

  it('returns a list of all non-deleted templates', async () => {
    const adminCookie = await global.getAuthCookie();
    
    // Create several templates
    await global.createIslandTemplate('Template 1', 'https://example.com/template1.png');
    await global.createIslandTemplate('Template 2', 'https://example.com/template2.png');
    await global.createIslandTemplate('Template 3', 'https://example.com/template3.png');
    
    // Create a deleted template
    const deletedTemplate = await global.createIslandTemplate(
      'Deleted Template', 
      'https://example.com/deleted.png'
    );
    deletedTemplate.isDeleted = true;
    deletedTemplate.deletedAt = new Date();
    await deletedTemplate.save();

    const response = await request(app)
      .get(BASE_URL)
      .set('Cookie', adminCookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(3);
    
    // Verify the deleted template is not included
    const templateNames = response.body.map((template: any) => template.name);
    expect(templateNames).toContain('Template 1');
    expect(templateNames).toContain('Template 2');
    expect(templateNames).toContain('Template 3');
    expect(templateNames).not.toContain('Deleted Template');
  });

  it('includes admin actions for each template', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);
    
    // Create a template
    const template = await global.createIslandTemplate();
    
    // Create an admin action for this template
    await global.createAdminIslandTemplateAction(adminId, template.id);

    const response = await request(app)
      .get(BASE_URL)
      .set('Cookie', adminCookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(1);
    expect(response.body[0].id).toEqual(template.id);
    expect(response.body[0].adminActions).toBeDefined();
    expect(response.body[0].adminActions.length).toEqual(1);
    expect(response.body[0].adminActions[0].adminId).toEqual(adminId);
  });
});
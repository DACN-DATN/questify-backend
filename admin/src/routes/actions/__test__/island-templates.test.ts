import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotAuthorizedError, UserRole } from '@datn242/questify-common';
import { AdminIslandTemplateActionType } from '../../../models/admin-island-template';

const BASE_URL = '/api/admin/actions/island-templates';

describe('List Admin Island Template Actions API', () => {
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

  it('returns an empty array when no actions exist', async () => {
    const cookie = await global.getAuthCookie();

    const response = await request(app)
      .get(BASE_URL)
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(0);
  });

  it('returns a list of all admin actions on island templates', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);
    
    // Create some island templates
    const template1 = await global.createIslandTemplate('Template 1');
    const template2 = await global.createIslandTemplate('Template 2');
    
    // Create admin actions
    await global.createAdminIslandTemplateAction(
      adminId,
      template1.id,
      AdminIslandTemplateActionType.Add,
      'New template added'
    );
    
    await global.createAdminIslandTemplateAction(
      adminId,
      template2.id,
      AdminIslandTemplateActionType.Remove,
      'Obsolete template removed'
    );

    const response = await request(app)
      .get(BASE_URL)
      .set('Cookie', adminCookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(2);
    
    // Verify both action types are present
    const actionTypes = response.body.map((action: any) => action.actionType);
    expect(actionTypes).toContain(AdminIslandTemplateActionType.Add);
    expect(actionTypes).toContain(AdminIslandTemplateActionType.Remove);
    
    // Check relationships are included
    expect(response.body[0].admin).toBeDefined();
    expect(response.body[0].islandTemplate).toBeDefined();
    expect(response.body[0].islandTemplate.name).toBeDefined();
  });

  it('includes deleted templates in actions', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);
    
    // Create a template that will be deleted
    const template = await global.createIslandTemplate('Template to Delete');
    
    // Create an add action
    await global.createAdminIslandTemplateAction(
      adminId,
      template.id,
      AdminIslandTemplateActionType.Add,
      'New template added'
    );
    
    // Mark the template as deleted
    template.isDeleted = true;
    template.deletedAt = new Date();
    await template.save();
    
    // Create a remove action
    await global.createAdminIslandTemplateAction(
      adminId,
      template.id,
      AdminIslandTemplateActionType.Remove,
      'Template removed'
    );

    const response = await request(app)
      .get(BASE_URL)
      .set('Cookie', adminCookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(2);
    
    // Both actions should be present, even though the template is deleted
    const template1 = response.body[0].islandTemplate;
    const template2 = response.body[1].islandTemplate;
    
    expect(template1.id).toEqual(template.id);
    expect(template2.id).toEqual(template.id);
    expect(template1.isDeleted).toEqual(true);
    expect(template2.isDeleted).toEqual(true);
  });

  it('supports filtering by template ID', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);
    
    // Create some templates
    const template1 = await global.createIslandTemplate('Template 1');
    const template2 = await global.createIslandTemplate('Template 2');
    
    // Create admin actions
    await global.createAdminIslandTemplateAction(adminId, template1.id);
    await global.createAdminIslandTemplateAction(adminId, template2.id);

    const response = await request(app)
      .get(`${BASE_URL}?islandTemplateId=${template1.id}`)
      .set('Cookie', adminCookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(1);
    expect(response.body[0].islandTemplateId).toEqual(template1.id);
  });

  it('supports filtering by action type', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);
    
    // Create a template
    const template = await global.createIslandTemplate();
    
    // Create admin actions with different types
    await global.createAdminIslandTemplateAction(
      adminId,
      template.id,
      AdminIslandTemplateActionType.Add,
      'Template added'
    );
    
    await global.createAdminIslandTemplateAction(
      adminId,
      template.id,
      AdminIslandTemplateActionType.Remove,
      'Template removed'
    );

    const response = await request(app)
      .get(`${BASE_URL}?actionType=${AdminIslandTemplateActionType.Add}`)
      .set('Cookie', adminCookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(1);
    expect(response.body[0].actionType).toEqual(AdminIslandTemplateActionType.Add);
  });

  it('returns actions sorted by creation date (newest first)', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);
    
    // Create a template
    const template = await global.createIslandTemplate();
    
    // Create admin actions with different dates
    // First action (older)
    const firstAction = await global.createAdminIslandTemplateAction(adminId, template.id);
    
    // Wait 100ms to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Second action (newer)
    const secondAction = await global.createAdminIslandTemplateAction(adminId, template.id);

    const response = await request(app)
      .get(BASE_URL)
      .set('Cookie', adminCookie)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(2);
    
    // The newest action should be first
    expect(response.body[0].id).toEqual(secondAction.id);
    expect(response.body[1].id).toEqual(firstAction.id);
  });
});
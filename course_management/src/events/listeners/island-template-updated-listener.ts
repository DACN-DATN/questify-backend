import { Message } from 'node-nats-streaming';
import { Subjects, Listener, IslandTemplateUpdatedEvent } from '@datn242/questify-common';
import { IslandTemplate } from '../../models/island-template';
import { queueGroupName } from './queue-group-name';

export class IslandTemplateUpdatedListener extends Listener<IslandTemplateUpdatedEvent> {
  subject: Subjects.IslandTemplateUpdated = Subjects.IslandTemplateUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: IslandTemplateUpdatedEvent['data'], msg: Message) {
    const { id, name, image_url, isDeleted, deletedAt } = data;
    
    const existingTemplate = await IslandTemplate.findByPk(id);
    
    if (!existingTemplate) {
      msg.ack();
      return;
    }
    
    // Create an update object with only the fields that are present in the event
    const updateFields: any = {};
    
    if (name !== undefined) updateFields.name = name;
    if (image_url !== undefined) updateFields.imageUrl = image_url;
    if (isDeleted !== undefined) updateFields.isDeleted = isDeleted;
    if (deletedAt !== undefined) updateFields.deletedAt = deletedAt;
    
    await IslandTemplate.update(
      updateFields,
      {
        where: { id }
      }
    );
    
    msg.ack();
  }
}
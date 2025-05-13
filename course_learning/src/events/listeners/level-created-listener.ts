import { Message } from 'node-nats-streaming';
import { Subjects, Listener, LevelCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Level } from '../../models/level';
import { Island } from '../../models/island';
import { retryService } from '../../services/retry-service';

export class LevelCreatedListener extends Listener<LevelCreatedEvent> {
  subject: Subjects.LevelCreated = Subjects.LevelCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: LevelCreatedEvent['data'], msg: Message) {
    try {
      const { id, islandId, name, description, position, contentType } = data;

      // Check if level already exists
      const existingLevel = await Level.findByPk(id);
      if (existingLevel) {
        console.log(`Level already exists with ID: ${id}`);
        msg.ack();
        return;
      }

      // Check if island exists
      const existingIsland = await Island.findByPk(islandId);
      if (!existingIsland) {
        console.log(`Island not found with ID: ${islandId}, queuing for retry`);
        // Add to retry queue instead of immediately acking
        await retryService.addEvent(this.subject, data);
        msg.ack();
        return;
      }

      const level = Level.build({
        id,
        name,
        description,
        position,
        islandId,
        contentType,
      });

      await level.save();

      msg.ack();
    } catch (error) {
      console.error('Error processing level:created event:', error);
      await retryService.addEvent(this.subject, data);
      msg.ack();
    }
  }
}
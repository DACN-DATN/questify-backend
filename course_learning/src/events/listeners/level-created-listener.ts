import { Message } from 'node-nats-streaming';
import { Subjects, Listener, LevelCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Level } from '../../models/level';
import { Island } from '../../models/island';

export class LevelCreatedListener extends Listener<LevelCreatedEvent> {
  subject: Subjects.LevelCreated = Subjects.LevelCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: LevelCreatedEvent['data'], msg: Message) {
    const { id, islandId, name, description, position } = data;
    const existingIsland = await Island.findByPk(islandId);
    if (!existingIsland) {
      console.warn(`Island not found with ID: ${islandId}, skipping course creation`);
      msg.ack();
    }
    const level = Level.build({
      id,
      name,
      description,
      position,
      islandId,
    });
    await level.save();

    msg.ack();
  }
}

import { Message } from 'node-nats-streaming';
import { Subjects, Listener, LevelUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Level } from '../../models/level';

export class LevelUpdatedListener extends Listener<LevelUpdatedEvent> {
  subject: Subjects.LevelUpdated = Subjects.LevelUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: LevelUpdatedEvent['data'], msg: Message) {
    const { id, islandId, name, description, position } = data;

    await Level.update(
      {
        name,
        description,
        position,
        islandId,
      },
      {
        where: { id },
      },
    );

    msg.ack();
  }
}

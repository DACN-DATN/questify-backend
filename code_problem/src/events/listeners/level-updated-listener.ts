import { Message } from 'node-nats-streaming';
import { Subjects, Listener, LevelUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Level } from '../../models/level';

export class LevelUpdatedListener extends Listener<LevelUpdatedEvent> {
  subject: Subjects.LevelUpdated = Subjects.LevelUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: LevelUpdatedEvent['data'], msg: Message) {
    const { id, teacherId, isDeleted } = data;

    await Level.update(
      {
        teacherId,
        isDeleted,
      },
      {
        where: { id },
      },
    );

    msg.ack();
  }
}

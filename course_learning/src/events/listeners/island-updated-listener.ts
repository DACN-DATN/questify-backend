import { Message } from 'node-nats-streaming';
import { Subjects, Listener, IslandUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Island } from '../../models/island';

export class IslandUpdatedListener extends Listener<IslandUpdatedEvent> {
  subject: Subjects.IslandUpdated = Subjects.IslandUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: IslandUpdatedEvent['data'], msg: Message) {
    const { id, courseId, name, description, position, backgroundImage, isDeleted } = data;

    await Island.update(
      {
        courseId,
        name,
        description,
        position,
        backgroundImage,
        isDeleted,
      },
      {
        where: { id },
      },
    );

    msg.ack();
  }
}

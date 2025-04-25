import { Message } from 'node-nats-streaming';
import { Subjects, Listener, IslandCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Island } from '../../models/island';

export class IslandCreatedListener extends Listener<IslandCreatedEvent> {
  subject: Subjects.IslandCreated = Subjects.IslandCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: IslandCreatedEvent['data'], msg: Message) {
    const { id, courseId, name, description, position, backgroundImage } = data;

    const island = Island.build({
      id,
      courseId,
      name,
      description,
      position,
      backgroundImage,
    });
    await island.save();

    msg.ack();
  }
}

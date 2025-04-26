import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserUpdatedEvent } from '@datn242/questify-common';
import { User } from '../../models/user';
import { queueGroupName } from './queue-group-name';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    const { id, role, status, gmail, userName } = data;

    await User.update({
      role,
      status,
      gmail,
      userName,
    },
      {
        where: { id },
      });

    msg.ack();
  }
}

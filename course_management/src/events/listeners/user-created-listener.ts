import { Message } from 'node-nats-streaming';
import { Listener, Subjects, UserCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { User } from '../../models/user';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const user = User.build({
      id: data.id,
      gmail: data.gmail,
      role: data.role,
      status: data.status,
    })

    await user.save();

    msg.ack();
  }
}

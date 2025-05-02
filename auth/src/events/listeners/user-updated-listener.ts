import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserUpdatedEvent } from '@datn242/questify-common';
import { User } from '../../models/user';
import { queueGroupName } from './queue-group-name';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    const { id, role, status, gmail, userName, exp } = data;

    const user = await User.findById(id);

    if (!user) {
      console.error(`[UserUpdatedListener] User with id ${id} not found.`);
      return;
    }

    user.set({
      role,
      status,
      email: gmail,
      userName,
      exp,
    });

    await user.save();

    msg.ack();
  }
}

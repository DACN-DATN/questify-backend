import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserCourseCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { initializeUserIslands } from '../../services/init-user-island.service';

export class UserCourseCreatedListener extends Listener<UserCourseCreatedEvent> {
  subject: Subjects.UserCourseCreated = Subjects.UserCourseCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCourseCreatedEvent['data'], msg: Message) {
    const { studentId, courseId } = data;

    await initializeUserIslands(courseId, studentId);

    msg.ack();
  }
}

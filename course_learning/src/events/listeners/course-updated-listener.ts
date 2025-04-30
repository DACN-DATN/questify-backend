import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CourseUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Course } from '../../models/course';

export class CourseUpdatedListener extends Listener<CourseUpdatedEvent> {
  subject: Subjects.CourseUpdated = Subjects.CourseUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: CourseUpdatedEvent['data'], msg: Message) {
    const { id, teacherId, status, name, description, backgroundImage, isDeleted } = data;

    await Course.update(
      {
        teacherId,
        name,
        description,
        status,
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

import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CourseCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Course } from '../../models/course';

export class CourseCreatedListener extends Listener<CourseCreatedEvent> {
  subject: Subjects.CourseCreated = Subjects.CourseCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: CourseCreatedEvent['data'], msg: Message) {
    const { id, teacherId, status, name, description, backgroundImage } = data;

    const course = Course.build({
      id,
      teacherId,
      status,
      name,
      description,
      backgroundImage,
    });
    await course.save();

    msg.ack();
  }
}

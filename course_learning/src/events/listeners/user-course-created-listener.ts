import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserCourseCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { initializeUserIslands } from '../../services/init-user-island.service';
import { User } from '../../models/user';
import { Course } from '../../models/course';

export class UserCourseCreatedListener extends Listener<UserCourseCreatedEvent> {
  subject: Subjects.UserCourseCreated = Subjects.UserCourseCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCourseCreatedEvent['data'], msg: Message) {
    const { studentId, courseId } = data;
    const existingStudent = await User.findByPk(studentId);
    if (!existingStudent) {
      console.warn(`Student not found with ID: ${studentId}`);
      msg.ack();
    }

    const existingCourse = await Course.findByPk(courseId);
    if (!existingCourse) {
      console.warn(`Course not found with ID: ${courseId}`);
      msg.ack();
    }
    await initializeUserIslands(courseId, studentId);

    msg.ack();
  }
}

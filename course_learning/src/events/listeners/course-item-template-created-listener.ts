import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CourseItemTemplateCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { CourseItemTemplate } from '../../models/course-item-template';

export class CourseItemTemplateCreatedListener extends Listener<CourseItemTemplateCreatedEvent> {
  subject: Subjects.CourseItemTemplateCreated = Subjects.CourseItemTemplateCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: CourseItemTemplateCreatedEvent['data'], msg: Message) {
    const { id, courseId, itemTemplateId, isDeleted } = data;
    
    const existingAssociation = await CourseItemTemplate.findByPk(id);
    
    if (existingAssociation) {
      console.warn(`CourseItemTemplate with ID: ${id} already exists, skipping creation`);
      msg.ack();
      return;
    }
    
    const courseItemTemplate = CourseItemTemplate.build({
      id,
      course_id: courseId,
      item_template_id: itemTemplateId,
      isDeleted: isDeleted || false,
    });
    
    await courseItemTemplate.save();

    msg.ack();
  }
}
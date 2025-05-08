import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CourseItemTemplateUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { CourseItemTemplate } from '../../models/course-item-template';

export class CourseItemTemplateUpdatedListener extends Listener<CourseItemTemplateUpdatedEvent> {
  subject: Subjects.CourseItemTemplateUpdated = Subjects.CourseItemTemplateUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: CourseItemTemplateUpdatedEvent['data'], msg: Message) {
    const { id, courseId, itemTemplateId, isDeleted } = data;
    
    const courseItemTemplate = await CourseItemTemplate.findByPk(id);
    
    if (!courseItemTemplate) {
      console.warn(`CourseItemTemplate with ID: ${id} not found, creating instead`);
      
      const newAssociation = CourseItemTemplate.build({
        id,
        course_id: courseId,
        item_template_id: itemTemplateId,
        isDeleted: isDeleted || false,
      });
      
      await newAssociation.save();
    } else {
      courseItemTemplate.isDeleted = isDeleted || false;
      
      if (isDeleted) {
        courseItemTemplate.deletedAt = new Date();
      } else {
        courseItemTemplate.deletedAt = undefined;
      }
      
      await courseItemTemplate.save();
    }

    msg.ack();
  }
}
import { Course } from '../course';
import { ItemTemplate } from '../item-template';
import { CourseItemTemplate } from '../course-item-template';

const defineCourseItemTemplateAssociations = () => {
  CourseItemTemplate.belongsTo(Course, {
    foreignKey: 'courseId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  CourseItemTemplate.belongsTo(ItemTemplate, {
    foreignKey: 'itemTemplateId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineCourseItemTemplateAssociations;

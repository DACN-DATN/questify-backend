import { Course } from '../course';
import { Island } from '../island';
import { User } from '../user';
import { Review } from '../review';
import { Reward } from '../reward';
import { Inventory } from '../inventory';
import { ItemTemplate } from '../item-template';
import { CourseItemTemplate } from '../course-item-template';

const defineCourseAssociations = () => {
  Course.belongsTo(User, {
    foreignKey: 'userId',
  });
  Course.hasMany(Island, { foreignKey: 'courseId' });
  Course.hasMany(Review, { foreignKey: 'courseId' });
  Course.hasMany(Reward, { foreignKey: 'courseId' });
  Course.hasMany(Inventory, { foreignKey: 'courseId' });
  Course.belongsToMany(ItemTemplate, {
    through: CourseItemTemplate,
    foreignKey: 'courseId',
    otherKey: 'itemTemplateId',
    as: 'itemTemplates',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Course.hasMany(CourseItemTemplate, { foreignKey: 'courseId' });
};

export default defineCourseAssociations;

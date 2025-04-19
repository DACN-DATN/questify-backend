import { Course } from '../course';
import { Island } from '../island';
import { User } from '../user';
import { Review } from '../review';
import { UserCourse } from '../user-course';
import { UserRole } from '@datn242/questify-common';

const defineCourseAssociations = () => {
  Course.belongsTo(User, {
    foreignKey: 'userId',
    as: 'teacher',
    constraints: false,
    scope: {
      role: UserRole.Teacher,
    },
  });
  Course.hasMany(Island, { foreignKey: 'courseId' });
  Course.hasMany(Review, { foreignKey: 'courseId' });
  Course.belongsToMany(User, {
    through: 'UserCourse',
    foreignKey: 'courseId',
    otherKey: 'studentId',
    as: 'students',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Course.hasMany(UserCourse, { foreignKey: 'courseId' });
};

export default defineCourseAssociations;

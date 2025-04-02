import { Course } from '../course';
import { User } from '../user';
import { AdminCourse } from '../admin-course';

const defineCourseAssociations = () => {
  // One-to-Many relationship with AdminCourse
  Course.hasMany(AdminCourse, {
    foreignKey: 'courseId',
    as: 'adminActions',
  });

  // Super Many-to-Many relationship with admin users
  Course.belongsToMany(User, {
    through: AdminCourse,
    foreignKey: 'courseId',
    otherKey: 'adminId',
    as: 'admins',
  });
};

export default defineCourseAssociations;

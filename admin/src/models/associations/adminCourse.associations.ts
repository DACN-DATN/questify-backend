import { AdminCourse } from '../adminCourse';
import { User } from '../user';
import { Course } from '../course';

const defineAdminCourseAssociations = () => {
  AdminCourse.belongsTo(User, {
    foreignKey: 'adminId',
    as: 'admin'
  });
  
  AdminCourse.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course'
  });
};

export default defineAdminCourseAssociations;
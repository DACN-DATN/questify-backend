import { Course } from '../course';
import { User } from '../user';
import { AdminCourse } from '../adminCourse';

const defineCourseAssociations = () => {
  Course.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher'
  });
  
  Course.hasMany(AdminCourse, {
    foreignKey: 'courseId',
    as: 'adminActions'
  });
};

export default defineCourseAssociations;
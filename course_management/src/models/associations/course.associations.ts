import { Course } from '../course';
import { Island } from '../island';
import { User } from '../user';

const defineCourseAssociations = () => {
  Course.belongsTo(User, {
    foreignKey: 'userId',
  });
  Course.hasMany(Island, { foreignKey: 'courseId' });
};

export default defineCourseAssociations;

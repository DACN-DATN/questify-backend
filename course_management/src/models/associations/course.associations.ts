import { Course } from '../course';
import { Island } from '../island';
import { User } from '../user';
import { Review } from '../review';

const defineCourseAssociations = () => {
  Course.belongsTo(User, {
    foreignKey: 'userId',
  });
  Course.hasMany(Island, { foreignKey: 'courseId' });
  Course.hasMany(Review, { foreignKey: 'courseId' });
};

export default defineCourseAssociations;

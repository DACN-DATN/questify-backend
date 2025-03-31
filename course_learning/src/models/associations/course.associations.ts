import { Course } from '../course';
import { Island } from '../island';
import { User } from '../user';
import { Review } from '../review';
import { Reward } from '../reward';

const defineCourseAssociations = () => {
  Course.belongsTo(User, {
    foreignKey: 'userId',
  });
  Course.hasMany(Island, { foreignKey: 'courseId' });
  Course.hasMany(Review, { foreignKey: 'courseId' });
  Course.hasMany(Reward, { foreignKey: 'courseId' });
};

export default defineCourseAssociations;

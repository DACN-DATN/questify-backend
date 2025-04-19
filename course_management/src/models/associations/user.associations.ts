import { Course } from '../course';
import { User } from '../user';
import { Review } from '../review';

const defineUserAssociations = () => {
  User.hasMany(Course, { foreignKey: 'userId' });
  User.hasMany(Review, { foreignKey: 'userId' });
};

export default defineUserAssociations;

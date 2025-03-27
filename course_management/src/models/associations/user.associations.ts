import { Course } from '../course';
import { User } from '../user';

const defineUserAssociations = () => {
  User.hasMany(Course, { foreignKey: 'userId' });
};

export default defineUserAssociations;

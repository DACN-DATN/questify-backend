import { Course } from '../course';
import { Feedback } from '../feedback';
import { User } from '../user';
import { Progress } from '../progress';
import { Review } from '../review';

const defineUserAssociations = () => {
  User.hasMany(Course, { foreignKey: 'userId' });
  User.hasMany(Feedback, { foreignKey: 'userId' });
  User.hasMany(Progress, { foreignKey: 'userId' });
  User.hasMany(Review, { foreignKey: 'userId' });
};

export default defineUserAssociations;

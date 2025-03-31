import { Course } from '../course';
import { Feedback } from '../feedback';
import { User } from '../user';
import { Review } from '../review';
import { Reward } from '../reward';
import { StudentReward } from '../student-reward';
import { Attempt } from '../attempt';

const defineUserAssociations = () => {
  User.hasMany(Course, { foreignKey: 'userId' });
  User.hasMany(Feedback, { foreignKey: 'userId' });
  User.hasMany(Review, { foreignKey: 'userId' });
  User.hasMany(Attempt, { foreignKey: 'userId' });
  User.belongsToMany(Reward, {
    through: StudentReward,
    foreignKey: 'studentId',
    otherKey: 'rewardId',
    as: 'rewards',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineUserAssociations;

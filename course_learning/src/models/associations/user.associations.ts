import { Course } from '../course';
import { Feedback } from '../feedback';
import { User } from '../user';
import { Progress } from '../progress';
import { Review } from '../review';
import { Reward } from '../reward';
import { StudentReward } from '../studentReward';

const defineUserAssociations = () => {
  User.hasMany(Course, { foreignKey: 'userId' });
  User.hasMany(Feedback, { foreignKey: 'userId' });
  User.hasMany(Progress, { foreignKey: 'userId' });
  User.hasMany(Review, { foreignKey: 'userId' });
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

import { User } from '../user';
import { Reward } from '../reward';
import { StudentReward } from '../student-reward';

const defineStudentRewardAssociations = () => {
  StudentReward.belongsTo(User, {
    foreignKey: 'studentId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  StudentReward.belongsTo(Reward, {
    foreignKey: 'rewardId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineStudentRewardAssociations;

import { Course } from '../course';
import { Island } from '../island';
import { Level } from '../level';
import { Reward } from '../reward';
import { User } from '../user';
import { UserReward } from '../user-reward';

const defineRewardAssociations = () => {
  Reward.belongsTo(Course, {
    foreignKey: 'courseId',
  });
  Reward.belongsTo(Island, {
    foreignKey: 'islandId',
  });
  Reward.belongsTo(Level, {
    foreignKey: 'levelId',
  });
  Reward.belongsToMany(User, {
    through: UserReward,
    foreignKey: 'rewardId',
    otherKey: 'userId',
    as: 'users',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineRewardAssociations;

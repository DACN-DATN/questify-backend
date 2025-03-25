import { Course } from '../course';
import { Island } from '../island';
import { Level } from '../level';
import { Reward } from '../reward';

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
};

export default defineRewardAssociations;

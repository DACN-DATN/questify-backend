import { Island } from '../island';
import { Level } from '../level';
import { Progress } from '../progress';
import { Reward } from '../reward';

const defineLevelAssociations = () => {
  Level.belongsTo(Island, { foreignKey: 'islandId' });
  Level.belongsTo(Progress, { foreignKey: 'progressId' });
  Level.hasMany(Reward, { foreignKey: 'levelId' });
};

export default defineLevelAssociations;

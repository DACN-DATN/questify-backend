import { Island } from '../island';
import { Level } from '../level';
import { Reward } from '../reward';
import { Hint } from '../hint';
import { Attempt } from '../attempt';
import { Challenge } from '../challenge';

const defineLevelAssociations = () => {
  Level.belongsTo(Island, { foreignKey: 'islandId' });
  Level.hasMany(Reward, { foreignKey: 'levelId' });
  Level.hasMany(Hint, { foreignKey: 'levelId' });
  Level.hasMany(Attempt, { foreignKey: 'levelId' });
  Level.hasOne(Challenge, { foreignKey: 'levelId' });
};

export default defineLevelAssociations;

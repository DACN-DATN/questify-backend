import { Island } from '../island';
import { Level } from '../level';
import { Progress } from '../progress';
import { Reward } from '../reward';
import { Slide } from '../slide';
import { Minigame } from '../minigame';

const defineLevelAssociations = () => {
  Level.belongsTo(Island, { foreignKey: 'islandId' });
  Level.belongsTo(Progress, { foreignKey: 'progressId' });
  Level.hasMany(Reward, { foreignKey: 'levelId' });
  Level.hasMany(Slide, { foreignKey: 'levelId' });
  Level.hasMany(Minigame, { foreignKey: 'levelId' });
};

export default defineLevelAssociations;

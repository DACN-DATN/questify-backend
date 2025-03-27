import { Minigame } from '../minigame';
import { Level } from '../level';

const defineMinigameAssociations = () => {
  Minigame.belongsTo(Level, { foreignKey: 'levelId' });
};

export default defineMinigameAssociations;

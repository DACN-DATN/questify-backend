import { Minigame } from '../minigame';
import { Challenge } from '../challenge';

const defineMinigameAssociations = () => {
  Minigame.belongsTo(Challenge, { foreignKey: 'challengeId' });
};

export default defineMinigameAssociations;

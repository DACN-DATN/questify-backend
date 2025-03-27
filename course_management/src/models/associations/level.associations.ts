import { Island } from '../island';
import { Level } from '../level';

const defineLevelAssociations = () => {
  Level.belongsTo(Island, { foreignKey: 'islandId' });
};

export default defineLevelAssociations;

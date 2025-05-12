import { IslandPath } from '../island-path';
import { Island } from '../island';

const defineIslandPathAssociations = () => {
  IslandPath.hasMany(Island, {
    foreignKey: 'islandPathId',
    as: 'islands'
  });
};

export default defineIslandPathAssociations;
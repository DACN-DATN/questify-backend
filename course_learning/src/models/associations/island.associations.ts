import { Island } from '../island';
import { Course } from '../course';
import { Level } from '../level';
import { PrerequisiteIsland } from '../prerequisite-island';
import { Reward } from '../reward';

const defineIslandAssociations = () => {
  Island.belongsTo(Course, { foreignKey: 'courseId' });
  Island.hasMany(Level, { foreignKey: 'islandId' });
  Island.belongsToMany(Island, {
    through: PrerequisiteIsland,
    foreignKey: 'islandId',
    otherKey: 'prerequisiteIslandId',
    as: 'prerequisites',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Island.belongsToMany(Island, {
    through: PrerequisiteIsland,
    foreignKey: 'prerequisiteIslandId',
    otherKey: 'islandId',
    as: 'islandsThatArePrerequisites',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Island.hasMany(Reward, { foreignKey: 'islandId' });
};

export default defineIslandAssociations;

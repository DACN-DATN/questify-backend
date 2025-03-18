import { Course } from './course';
import { Island } from './island';
import { User } from './user';
import { Level } from './level';
import { PrerequisiteIsland } from './prerequisiteIsland';

Course.belongsTo(User, {
  foreignKey: 'userId',
});
Course.hasMany(Island, { foreignKey: 'courseId' });

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

Level.belongsTo(Island, { foreignKey: 'islandId' });

PrerequisiteIsland.belongsTo(Island, {
  foreignKey: 'islandId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
PrerequisiteIsland.belongsTo(Island, {
  foreignKey: 'prerequisiteIslandId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

User.hasMany(Course, { foreignKey: 'userId' });

export { Course, Island, User, Level, PrerequisiteIsland };

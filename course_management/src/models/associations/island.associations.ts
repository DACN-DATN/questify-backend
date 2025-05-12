// src/models/associations/island.associations.ts
import { Island } from '../island';
import { Course } from '../course';
import { Level } from '../level';
import { PrerequisiteIsland } from '../prerequisiteIsland';
import { IslandTemplate } from '../island-template';
import { IslandPath } from '../island-path';
import { IslandBackgroundImage } from '../island-background-image';

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

  Island.belongsTo(IslandTemplate, { 
    foreignKey: 'islandTemplateId',
    as: 'template'
  });
  
  Island.belongsTo(IslandPath, { 
    foreignKey: 'islandPathId',
    as: 'path'
  });
  
  Island.belongsTo(IslandBackgroundImage, { 
    foreignKey: 'islandBackgroundImageId',
    as: 'backgroundImage'
  });
};

export default defineIslandAssociations;
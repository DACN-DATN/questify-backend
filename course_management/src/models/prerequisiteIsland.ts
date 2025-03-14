import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { Island } from './island';

class PrerequisiteIsland extends Model {
  public islandId!: string;
  public prerequisiteIslandId!: string;
}

PrerequisiteIsland.init(
  {
    islandId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: Island,
        key: 'id',
      },
    },
    prerequisiteIslandId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: Island,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'PrerequisiteIsland',
    tableName: 'prerequisite_islands',
  },
);

PrerequisiteIsland.belongsTo(Island, { foreignKey: 'islandId' });
PrerequisiteIsland.belongsTo(Island, { foreignKey: 'prerequisiteIslandId' });

export { PrerequisiteIsland };

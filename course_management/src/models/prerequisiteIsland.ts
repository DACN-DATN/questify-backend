import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Island } from './island';

const PrerequisiteIslandDefinition = {
  islandId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: Island,
      key: 'id',
    },
    validate: {
      isUUID: 4,
    },
  },
  prerequisiteIslandId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: Island,
      key: 'id',
    },
    validate: {
      isUUID: 4,
    },
  },
};

interface PrerequisiteIslandAttributes {
  islandId: string;
  prerequisiteIslandId: string;
}

interface PrerequisiteIslandCreationAttributes
  extends Optional<PrerequisiteIslandAttributes, 'islandId' | 'prerequisiteIslandId'> {}

class PrerequisiteIsland
  extends Model<PrerequisiteIslandAttributes, PrerequisiteIslandCreationAttributes>
  implements PrerequisiteIslandAttributes
{
  public islandId!: string;
  public prerequisiteIslandId!: string;

  static readonly scopes = {};
  static readonly validations = {};
}

PrerequisiteIsland.init(PrerequisiteIslandDefinition, {
  sequelize,
  tableName: 'prerequisite_islands',
  underscored: true,
  createdAt: false,
  updatedAt: false,
  scopes: PrerequisiteIsland.scopes,
  validate: PrerequisiteIsland.validations,
  indexes: [
    {
      unique: true,
      fields: ['islandId', 'prerequisiteIslandId'],
    },
  ],
});

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

export { PrerequisiteIsland };

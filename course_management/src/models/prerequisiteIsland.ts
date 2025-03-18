import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Island } from './island';

const PrerequisiteIslandDefinition = {
  islandId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Island,
      key: 'id',
    },
    validate: {
      isInt: true,
    },
  },
  prerequisiteIslandId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Island,
      key: 'id',
    },
    validate: {
      isInt: true,
    },
  },
};

interface PrerequisiteIslandAttributes {
  islandId: number;
  prerequisiteIslandId: number;
}

interface PrerequisiteIslandCreationAttributes
  extends Optional<PrerequisiteIslandAttributes, 'islandId' | 'prerequisiteIslandId'> {}

class PrerequisiteIsland
  extends Model<PrerequisiteIslandAttributes, PrerequisiteIslandCreationAttributes>
  implements PrerequisiteIslandAttributes
{
  public islandId!: number;
  public prerequisiteIslandId!: number;

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
      fields: ['island_id', 'prerequisite_island_id'],
    },
  ],
});

export { PrerequisiteIsland };

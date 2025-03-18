import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { Island } from './island';

const LevelDefinition = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  position: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  islandId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: Island,
      key: 'id',
    },
    validate: {
      isInt: true,
    },
  },
};

interface LevelAttributes {
  id: number;
  name: string;
  description?: string;
  position: number;
  islandId: string;
}

interface LevelCreationAttributes extends Optional<LevelAttributes, 'id'> {}

class Level extends Model<LevelAttributes, LevelCreationAttributes> implements LevelAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public position!: number;
  public islandId!: string;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

Level.init(LevelDefinition, {
  sequelize,
  tableName: 'levels',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  scopes: Level.scopes,
  validate: Level.validations,
});

export { Level };

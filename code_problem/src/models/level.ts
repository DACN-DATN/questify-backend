import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

declare enum LevelContent {
  Challenge = 'challenge',
  CodeProblem = 'code_problem',
}

const LevelDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
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
  content_type: {
    allowNull: true,
    type: DataTypes.STRING,
    validate: {
      isIn: [[LevelContent.Challenge, LevelContent.CodeProblem]],
    },
  },
};

interface LevelAttributes {
  id: string;
  name: string;
  description?: string;
  position: number;
  content_type?: LevelContent;
}

type LevelCreationAttributes = Optional<LevelAttributes, 'id'>;

class Level extends Model<LevelAttributes, LevelCreationAttributes> implements LevelAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public position!: number;
  public content_type?: LevelContent;

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

import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { LevelContent } from '@datn242/questify-common';
import { User } from './user';

const LevelDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  teacherId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
      max: 120,
      min: 0,
    },
  },
  description: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
      max: 120,
      min: 0,
    },
  },
  position: {
    allowNull: true,
    type: DataTypes.INTEGER,
    validate: {
      notEmpty: true,
      min: 0,
    },
  },
  content_type: {
    allowNull: true,
    type: DataTypes.STRING,
    validate: {
      isIn: [[LevelContent.Challenge, LevelContent.CodeProblem]],
    },
  },
  isDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

interface LevelAttributes {
  id: string;
  teacherId: string;
  name: string;
  description: string;
  position: number;
  content_type?: LevelContent;
  isDeleted: boolean;
}

type LevelCreationAttributes = Optional<LevelAttributes, 'id' | 'isDeleted'>;

class Level extends Model<LevelAttributes, LevelCreationAttributes> implements LevelAttributes {
  public id!: string;
  public teacherId!: string;
  public name!: string;
  public description!: string;
  public position!: number;
  public content_type?: LevelContent;
  public isDeleted!: boolean;

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

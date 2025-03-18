import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { Course } from './course';

const IslandDefinition = {
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
  backgroundImage: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  courseId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: 'id',
    },
    validate: {
      isInt: true,
    },
  },
};

interface IslandAttributes {
  id: number;
  name: string;
  description?: string;
  position: number;
  backgroundImage?: string;
  courseId: string;
}

interface IslandCreationAttributes extends Optional<IslandAttributes, 'id'> {}

class Island extends Model<IslandAttributes, IslandCreationAttributes> implements IslandAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public position!: number;
  public backgroundImage?: string;
  public courseId!: string;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

Island.init(IslandDefinition, {
  sequelize,
  tableName: 'islands',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  scopes: Island.scopes,
  validate: Island.validations,
});

export { Island };

import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';

const CourseDefinition = {
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
  uploadDate: {
    allowNull: false,
    type: DataTypes.DATE,
    validate: {
      isDate: true,
    },
  },
  backgroundImage: {
    allowNull: true,
    type: DataTypes.STRING, // may change this later
  },
  teacherId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    validate: {
      isInt: true,
    },
  },
  isDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedAt: {
    allowNull: true,
    type: DataTypes.DATE,
  },
};

interface CourseAttributes {
  id: number;
  name: string;
  description?: string;
  uploadDate: Date;
  backgroundImage?: string;
  teacherId: string;
  isDeleted: boolean;
  deletedAt?: Date;
}

interface CourseCreationAttributes
  extends Optional<CourseAttributes, 'id' | 'isDeleted' | 'deletedAt'> {}

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public uploadDate!: Date;
  public backgroundImage?: string;
  public teacherId!: string;
  public isDeleted!: boolean;
  public deletedAt?: Date;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

Course.init(CourseDefinition, {
  sequelize,
  tableName: 'courses',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  scopes: Course.scopes,
  validate: Course.validations,
});

export { Course };

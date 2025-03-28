import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

const CourseDefinition = {
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
      len: [2, 100] as [number, number],
    },
  },
  description: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  backgroundImage: {
    allowNull: true,
    type: DataTypes.STRING, // may change this later
  },
  teacherId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
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
  id: string;
  name: string;
  description?: string;
  backgroundImage?: string;
  teacherId: string;
  isDeleted: boolean;
  deletedAt?: Date;
}

type CourseCreationAttributes = Optional<CourseAttributes, 'id' | 'isDeleted' | 'deletedAt'>;

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public backgroundImage?: string;
  public teacherId!: string;
  public isDeleted!: boolean;
  public deletedAt?: Date;

  public getProgresses!: () => Promise<Course>;

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

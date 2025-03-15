import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';

const CourseDefinition = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
    validate: {
      isUUID: 4,
    },
  },
};

interface CourseAttributes {
  id: string;
  name: string;
  description?: string;
  uploadDate: Date;
  backgroundImage?: string;
  teacherId: string;
}

interface CourseCreationAttributes extends Optional<CourseAttributes, 'id'> {}

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public uploadDate!: Date;
  public backgroundImage?: string;
  public teacherId!: string;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

// Initialization
Course.init(CourseDefinition, {
  sequelize,
  tableName: 'courses',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  scopes: Course.scopes,
  validate: Course.validations,
});

Course.belongsTo(User, {
  foreignKey: 'teacherId',
  constraints: true,
  scope: { role: 'teacher' },
});

export { Course };

import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { UserRole } from '@datn242/questify-common';

const UserDefinition = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  gmail: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  hashedPassword: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  phoneNumber: {
    allowNull: true,
    type: DataTypes.STRING,
    validate: {
      is: /^[0-9]{10,15}$/,
    },
  },
  firstName: {
    allowNull: true,
    type: DataTypes.STRING,
    validate: {
      isAlpha: true,
    },
  },
  lastName: {
    allowNull: true,
    type: DataTypes.STRING,
    validate: {
      isAlpha: true,
    },
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isIn: [[UserRole.Student, UserRole.Teacher, UserRole.Admin]],
    },
  },
};

interface UserAttributes {
  id: number;
  gmail?: string;
  hashedPassword: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public gmail?: string;
  public hashedPassword!: string;
  public phoneNumber?: string;
  public firstName?: string;
  public lastName?: string;
  public role!: UserRole;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

User.init(UserDefinition, {
  sequelize,
  tableName: 'users',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  scopes: User.scopes,
  validate: User.validations,
});

export { User };

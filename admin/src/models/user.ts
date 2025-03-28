import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { UserRole, UserStatus } from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';

const UserDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
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
  status: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isIn: [[UserStatus.Active, UserStatus.Inactive, UserStatus.Suspended]],
    },
    defaultValue: UserStatus.Active,
  },
};

interface UserAttributes {
  id: string;
  gmail?: string;
  hashedPassword: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public gmail?: string;
  public hashedPassword!: string;
  public phoneNumber?: string;
  public firstName?: string;
  public lastName?: string;
  public role!: UserRole;
  public status!: UserStatus;

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

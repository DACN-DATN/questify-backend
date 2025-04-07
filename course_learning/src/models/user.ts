import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { UserRole } from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';
import type { Reward } from './reward';

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
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isIn: [[UserRole.Student, UserRole.Teacher, UserRole.Admin]],
    },
  },
  userName: {
    allowNull: false,
    type: DataTypes.STRING,
  },
};

interface UserAttributes {
  id: string;
  gmail: string;
  role: UserRole;
  userName: string;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public gmail!: string;
  public role!: UserRole;
  public userName!: string;

  public readonly rewards?: Reward[];

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};

  declare addReward: (reward: Reward) => Promise<void>;
  declare getRewards: () => Promise<Reward[]>;
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

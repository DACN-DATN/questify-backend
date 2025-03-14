import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { UserRole } from '@datn242/questify-common';

class User extends Model {
  public id!: string;
  public gmail!: string;
  public hashedPassword!: string;
  public phoneNumber!: string;
  public firstName!: string;
  public lastName!: string;
  public userType!: UserRole;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    gmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 128],
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      validate: {
        is: /^[0-9]{10,15}$/,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
      },
    },
    role: {
      type: DataTypes.ENUM(UserRole.Student, UserRole.Teacher, UserRole.Admin),
      allowNull: false,
      validate: {
        isIn: [Object.values(UserRole)],
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  },
);

export { User };

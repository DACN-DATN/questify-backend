import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { Level } from './level';
import { v4 as uuidv4 } from 'uuid';
import { CompletionStatus } from '@datn242/questify-common';

const UserLevelDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  userId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  levelId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Level,
      key: 'id',
    },
  },
  point: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  completionStatus: {
    allowNull: false,
    type: DataTypes.ENUM(
      CompletionStatus.InProgress,
      CompletionStatus.Completed,
      CompletionStatus.Fail,
      CompletionStatus.Locked,
    ),
    defaultValue: CompletionStatus.InProgress,
  },
  finishedDate: {
    allowNull: true,
    type: DataTypes.DATE,
  },
};

interface UserLevelAttributes {
  id: string;
  userId: string;
  levelId: string;
  point: number;
  completionStatus: CompletionStatus;
  finishedDate?: Date;
}

class UserLevel extends Model<UserLevelAttributes> implements UserLevelAttributes {
  public id!: string;
  public userId!: string;
  public levelId!: string;
  public point!: number;
  public completionStatus!: CompletionStatus;
  public finishedDate?: Date;
}

UserLevel.init(UserLevelDefinition, {
  sequelize,
  tableName: 'user-levels',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { UserLevel };

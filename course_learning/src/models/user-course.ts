import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { Course } from './course';
import { v4 as uuidv4 } from 'uuid';
import { CompletionStatus } from '@datn242/questify-common';

const UserCourseDefinition = {
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
  courseId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Course,
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
    ),
    defaultValue: CompletionStatus.InProgress,
  },
  finishedDate: {
    allowNull: true,
    type: DataTypes.DATE,
  },
};

interface UserCourseAttributes {
  id: string;
  userId: string;
  courseId: string;
  point: number;
  completionStatus: CompletionStatus;
  finishedDate?: Date;
}

class UserCourse extends Model<UserCourseAttributes> implements UserCourseAttributes {
  public id!: string;
  public userId!: string;
  public courseId!: string;
  public point!: number;
  public completionStatus!: CompletionStatus;
  public finishedDate?: Date;
}

UserCourse.init(UserCourseDefinition, {
  sequelize,
  tableName: 'user-courses',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { UserCourse };

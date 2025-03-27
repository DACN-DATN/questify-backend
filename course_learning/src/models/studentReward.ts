import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { Reward } from './reward';
import { v4 as uuidv4 } from 'uuid';

const StudentRewardDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  studentId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  rewardId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    references: {
      model: Reward,
      key: 'id',
    },
  },
};

interface StudentRewardAttributes {
  id: string;
  studentId: string;
  rewardId: string;
}

class StudentReward extends Model<StudentRewardAttributes> implements StudentRewardAttributes {
  public id!: string;
  public studentId!: string;
  public rewardId!: string;
}

StudentReward.init(StudentRewardDefinition, {
  sequelize,
  tableName: 'student_reward',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { StudentReward };

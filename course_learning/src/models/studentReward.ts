import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { Reward } from './reward';

const StudentRewardDefinition = {
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
  studentId: string;
  rewardId: string;
}

class StudentReward extends Model<StudentRewardAttributes> implements StudentRewardAttributes {
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

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
// import { User } from './user';
// import { Reward } from './reward';
import { v4 as uuidv4 } from 'uuid';

const UserRewardDefinition = {
  userId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  rewardId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: 'rewards',
      key: 'id',
    },
  },
};

interface UserRewardAttributes {
  id?: string;
  userId: string;
  rewardId: string;
}

type UserRewardCreationAttributes = Optional<UserRewardAttributes, 'id'>;

class UserReward
  extends Model<UserRewardAttributes, UserRewardCreationAttributes>
  implements UserRewardAttributes
{
  public userId!: string;
  public rewardId!: string;
}

UserReward.init(UserRewardDefinition, {
  sequelize,
  tableName: 'user_reward',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { UserReward };

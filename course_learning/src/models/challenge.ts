import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Level } from './level';
import { v4 as uuidv4 } from 'uuid';

const ChallengeDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  levelId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Level,
      key: 'id',
    },
  },
};

interface ChallengeAttributes {
  id: string;
  levelId: string;
}

type ChallengeCreationAttributes = Optional<ChallengeAttributes, 'id'>;

class Challenge
  extends Model<ChallengeAttributes, ChallengeCreationAttributes>
  implements ChallengeAttributes
{
  public id!: string;
  public levelId!: string;
}

Challenge.init(ChallengeDefinition, {
  sequelize,
  tableName: 'challenges',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { Challenge };

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
  description: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
      len: [1, 1000] as [number, number],
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
};

interface ChallengeAttributes {
  id: string;
  description: string;
  levelId: string;
}

type ChallengeCreationAttributes = Optional<ChallengeAttributes, 'id'>;

class Challenge
  extends Model<ChallengeAttributes, ChallengeCreationAttributes>
  implements ChallengeAttributes
{
  public id!: string;
  public description!: string;
  public levelId!: string;

  public readonly level?: Level;

  public getLevel!: () => Promise<Level>;
  public addLevel!: (level: Level) => Promise<void>;
}

Challenge.init(ChallengeDefinition, {
  sequelize,
  tableName: 'challenges',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { Challenge };

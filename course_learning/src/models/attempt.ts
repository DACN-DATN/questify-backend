import { Model, DataTypes, Optional, HasOneGetAssociationMixin } from 'sequelize';
import { sequelize } from '../config/db';
import { Level } from './level';
import { User } from './user';
import { Feedback } from './feedback';
import { v4 as uuidv4 } from 'uuid';

const AttemptDefinition = {
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
  answer: {
    allowNull: true,
    type: DataTypes.JSON,
  },
  point: {
    allowNull: true,
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
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

interface AttemptAttributes {
  id: string;
  userId: string;
  answer?: object;
  point?: number;
  levelId: string;
}

type AttemptCreationAttributes = Optional<AttemptAttributes, 'id'>;

class Attempt
  extends Model<AttemptAttributes, AttemptCreationAttributes>
  implements AttemptAttributes
{
  public id!: string;
  public userId!: string;
  public answer?: object;
  public point?: number;
  public levelId!: string;

  declare public getFeedback: HasOneGetAssociationMixin<Feedback>;
}

Attempt.init(AttemptDefinition, {
  sequelize,
  tableName: 'attempts',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { Attempt };

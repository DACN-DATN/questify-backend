import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

const FeedbackDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  message: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
      len: [1, 1000] as [number, number],
    },
  },
  teacherId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
};

interface FeedbackAttributes {
  id: string;
  message: string;
  teacherId: string;
}

type FeedbackCreationAttributes = Optional<FeedbackAttributes, 'id'>;

class Feedback
  extends Model<FeedbackAttributes, FeedbackCreationAttributes>
  implements FeedbackAttributes
{
  public id!: string;
  public message!: string;
  public teacherId!: string;
}

Feedback.init(FeedbackDefinition, {
  sequelize,
  tableName: 'feedback',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { Feedback };

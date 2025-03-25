import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { Progress } from './progress';
import { v4 as uuidv4 } from 'uuid';

const FeedbackDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  description: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  uploadDate: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  teacherId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  progressId: {
    allowNull: true,
    type: DataTypes.UUID,
    references: {
      model: Progress,
      key: 'id',
    },
  },
};

interface FeedbackAttributes {
  id: string;
  description?: string;
  uploadDate: Date;
  teacherId: string;
  progressId?: string;
}

type FeedbackCreationAttributes = Optional<FeedbackAttributes, 'id' | 'uploadDate'>;

class Feedback
  extends Model<FeedbackAttributes, FeedbackCreationAttributes>
  implements FeedbackAttributes
{
  public id!: string;
  public description?: string;
  public uploadDate!: Date;
  public teacherId!: string;
  public progressId?: string;
}

Feedback.init(FeedbackDefinition, {
  sequelize,
  tableName: 'feedback',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { Feedback };

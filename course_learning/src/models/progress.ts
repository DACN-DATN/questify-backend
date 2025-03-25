import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { Course } from './course';
import { Island } from './island';
import { Level } from './level';
import { v4 as uuidv4 } from 'uuid';

const ProgressDefinition = {
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
  progress: {
    allowNull: true,
    type: DataTypes.JSON,
  },
  startDate: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  finishDate: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  courseId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Course,
      key: 'id',
    },
  },
  islandId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Island,
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
};

interface ProgressAttributes {
  id: string;
  studentId: string;
  progress?: any;
  startDate: Date;
  finishDate?: Date;
  courseId: string;
  islandId: string;
  levelId: string;
}

type ProgressCreationAttributes = Optional<ProgressAttributes, 'id' | 'startDate' | 'finishDate'>;

class Progress
  extends Model<ProgressAttributes, ProgressCreationAttributes>
  implements ProgressAttributes
{
  public id!: string;
  public studentId!: string;
  public progress?: any;
  public startDate!: Date;
  public finishDate?: Date;
  public courseId!: string;
  public islandId!: string;
  public levelId!: string;
}

Progress.init(ProgressDefinition, {
  sequelize,
  tableName: 'progress',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { Progress };

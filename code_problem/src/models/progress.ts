import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { Level } from './level';
import { v4 as uuidv4 } from 'uuid';

type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

const ProgressDefinition = {
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
  userId: string;
  progress?: JsonValue;
  startDate: Date;
  finishDate?: Date;
  levelId: string;
}

type ProgressCreationAttributes = Optional<ProgressAttributes, 'id' | 'startDate' | 'finishDate'>;

class Progress
  extends Model<ProgressAttributes, ProgressCreationAttributes>
  implements ProgressAttributes
{
  public id!: string;
  public userId!: string;
  public progress?: JsonValue;
  public startDate!: Date;
  public finishDate?: Date;
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

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Challenge } from './challenge';
import { v4 as uuidv4 } from 'uuid';

type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

const MinigameDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  challengeId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Challenge,
      key: 'id',
    },
  },
  type: {
    allowNull: false,
    type: DataTypes.ENUM('quiz', 'puzzle', 'other'), // Adjust enum values as needed
    validate: {
      notEmpty: true,
    },
  },
  description: {
    allowNull: true,
    type: DataTypes.JSON,
  },
  answer: {
    allowNull: true,
    type: DataTypes.JSON,
  },
  position: {
    allowNull: false,
    type: DataTypes.INTEGER,
    validate: {
      notEmpty: true,
      min: 0,
    },
    defaultValue: 0,
  },
};

interface MinigameAttributes {
  id: string;
  challengeId: string;
  type: string;
  description?: JsonValue;
  answer?: JsonValue;
  position: number;
}

type MinigameCreationAttributes = Optional<MinigameAttributes, 'id'>;

class Minigame
  extends Model<MinigameAttributes, MinigameCreationAttributes>
  implements MinigameAttributes
{
  public id!: string;
  public challengeId!: string;
  public type!: string;
  public description?: JsonValue;
  public answer?: JsonValue;
  public position!: number;
}

Minigame.init(MinigameDefinition, {
  sequelize,
  tableName: 'minigames',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  indexes: [
    {
      unique: true,
      fields: ['position'],
    },
  ],
});

export { Minigame };

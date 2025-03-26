import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Level } from './level';
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
      model: Level,
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
};

interface MinigameAttributes {
  id: string;
  challengeId: string;
  type: string;
  description?: JsonValue;
  answer?: JsonValue;
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
}

Minigame.init(MinigameDefinition, {
  sequelize,
  tableName: 'minigames',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { Minigame };

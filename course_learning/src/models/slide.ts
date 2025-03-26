import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Level } from './level';
import { SlideTemplate } from './slideTemplate';
import { v4 as uuidv4 } from 'uuid';

type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

const SlideDefinition = {
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
  parameterValue: {
    allowNull: true,
    type: DataTypes.JSON,
  },
  slideTemplateId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: SlideTemplate,
      key: 'id',
    },
  },
};

interface SlideAttributes {
  id: string;
  challengeId: string;
  parameterValue?: JsonValue;
  slideTemplateId: string;
}

type SlideCreationAttributes = Optional<SlideAttributes, 'id'>;

class Slide extends Model<SlideAttributes, SlideCreationAttributes> implements SlideAttributes {
  public id!: string;
  public challengeId!: string;
  public parameterValue?: JsonValue;
  public slideTemplateId!: string;
}

Slide.init(SlideDefinition, {
  sequelize,
  tableName: 'slides',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { Slide };

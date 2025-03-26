import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Challenge } from './challenge';
import { SlideCategory } from './slideTemplate';
import { v4 as uuidv4 } from 'uuid';

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
      model: Challenge,
      key: 'id',
    },
  },
  parameterValue: {
    allowNull: true,
    type: DataTypes.JSON,
  },
  categoryId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: SlideCategory,
      key: 'id',
    },
  },
};

interface SlideAttributes {
  id: string;
  challengeId: string;
  parameterValue?: any;
  categoryId: string;
}

type SlideCreationAttributes = Optional<SlideAttributes, 'id'>;

class Slide extends Model<SlideAttributes, SlideCreationAttributes> implements SlideAttributes {
  public id!: string;
  public challengeId!: string;
  public parameterValue?: any;
  public categoryId!: string;
}

Slide.init(SlideDefinition, {
  sequelize,
  tableName: 'slides',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { Slide };

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

const SlideTemplateDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  parameter: {
    allowNull: true,
    type: DataTypes.JSON,
  },
};

interface SlideTemplateAttributes {
  id: string;
  parameter?: any;
}

type SlideTemplateCreationAttributes = Optional<SlideTemplateAttributes, 'id'>;

class SlideTemplate
  extends Model<SlideTemplateAttributes, SlideTemplateCreationAttributes>
  implements SlideTemplateAttributes
{
  public id!: string;
  public parameter?: any;
}

SlideTemplate.init(SlideTemplateDefinition, {
  sequelize,
  tableName: 'slide_template',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { SlideTemplate };

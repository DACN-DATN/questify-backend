import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

const SlideCategoryDefinition = {
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

interface SlideCategoryAttributes {
  id: string;
  parameter?: any;
}

type SlideCategoryCreationAttributes = Optional<SlideCategoryAttributes, 'id'>;

class SlideCategory
  extends Model<SlideCategoryAttributes, SlideCategoryCreationAttributes>
  implements SlideCategoryAttributes
{
  public id!: string;
  public parameter?: any;
}

SlideCategory.init(SlideCategoryDefinition, {
  sequelize,
  tableName: 'slide_category',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { SlideCategory };

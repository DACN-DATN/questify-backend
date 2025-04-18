import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

const ItemTemplateDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  gold: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  effect: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  effect_description: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      len: [1, 255] as [number, number],
    },
  },
  description: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      len: [1, 255] as [number, number],
    },
  },
  img: {
    allowNull: false,
    type: DataTypes.STRING,
  },
};

interface ItemTemplateAttributes {
  id: string;
  gold: number;
  effect: string;
  effect_description: string;
  description: string;
  img: string;
}

type ItemTemplateCreationAttributes = Optional<ItemTemplateAttributes, 'id'>;

class ItemTemplate
  extends Model<ItemTemplateAttributes, ItemTemplateCreationAttributes>
  implements ItemTemplateAttributes
{
  public id!: string;
  public gold!: number;
  public effect!: string;
  public effect_description!: string;
  public description!: string;
  public img!: string;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

ItemTemplate.init(ItemTemplateDefinition, {
  sequelize,
  tableName: 'item_templates',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  scopes: ItemTemplate.scopes,
  validate: ItemTemplate.validations,
});

export { ItemTemplate };

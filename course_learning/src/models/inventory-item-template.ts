import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { Inventory } from './inventory';
import { ItemTemplate } from './item-template';
import { v4 as uuidv4 } from 'uuid';

const InventoryItemTemplateDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  quantity: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  inventoryId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Inventory,
      key: 'id',
    },
  },
  itemTemplateId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: ItemTemplate,
      key: 'id',
    },
  },
};

interface InventoryItemTemplateAttributes {
  id: string;
  quantity: number;
  inventoryId: string;
  itemTemplateId: string;
}

type InventoryItemTemplateCreationAttributes = Optional<InventoryItemTemplateAttributes, 'id'>;

class InventoryItemTemplate
  extends Model<InventoryItemTemplateAttributes, InventoryItemTemplateCreationAttributes>
  implements InventoryItemTemplateAttributes
{
  public id!: string;
  public quantity!: number;
  public inventoryId!: string;
  public itemTemplateId!: string;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

InventoryItemTemplate.init(InventoryItemTemplateDefinition, {
  sequelize,
  tableName: 'inventory_item_templates',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  scopes: InventoryItemTemplate.scopes,
  validate: InventoryItemTemplate.validations,
});

export { InventoryItemTemplate };

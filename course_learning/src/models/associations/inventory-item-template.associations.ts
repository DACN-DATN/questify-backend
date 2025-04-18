import { Inventory } from '../inventory';
import { ItemTemplate } from '../item-template';
import { InventoryItemTemplate } from '../inventory-item-template';

const defineInventoryItemTemplateAssociations = () => {
  InventoryItemTemplate.belongsTo(Inventory, {
    foreignKey: 'inventoryId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  InventoryItemTemplate.belongsTo(ItemTemplate, {
    foreignKey: 'itemTemplateId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineInventoryItemTemplateAssociations;

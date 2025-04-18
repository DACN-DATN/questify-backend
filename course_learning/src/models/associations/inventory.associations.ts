import { Course } from '../course';
import { Inventory } from '../inventory';
import { User } from '../user';
import { ItemTemplate } from '../item-template';
import { InventoryItemTemplate } from '../inventory-item-template';

const defineInventoryAssociations = () => {
  Inventory.belongsTo(Course, { foreignKey: 'courseId' });
  Inventory.belongsTo(User, { foreignKey: 'userId' });
  Inventory.belongsToMany(ItemTemplate, {
    through: InventoryItemTemplate,
    foreignKey: 'inventoryId',
    otherKey: 'itemTemplateId',
    as: 'itemTemplates',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Inventory.hasMany(InventoryItemTemplate, { foreignKey: 'inventoryId' });
};

export default defineInventoryAssociations;

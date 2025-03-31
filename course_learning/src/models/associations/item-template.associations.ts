import { ItemTemplate } from '../item-template';
import { Inventory } from '../inventory';
import { InventoryItemTemplate } from '../inventory-item-template';
import { Course } from '../course';
import { CourseItemTemplate } from '../course-item-template';

const defineItemTemplateAssociations = () => {
  ItemTemplate.belongsToMany(Inventory, {
    through: InventoryItemTemplate,
    foreignKey: 'itemTemplateId',
    otherKey: 'inventoryId',
    as: 'inventories',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  ItemTemplate.hasMany(InventoryItemTemplate, {
    foreignKey: 'itemTemplateId',
  });

  ItemTemplate.belongsToMany(Course, {
    through: CourseItemTemplate,
    foreignKey: 'itemTemplateId',
    otherKey: 'courseId',
    as: 'courses',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  ItemTemplate.hasMany(CourseItemTemplate, {
    foreignKey: 'itemTemplateId',
  });
};

export default defineItemTemplateAssociations;

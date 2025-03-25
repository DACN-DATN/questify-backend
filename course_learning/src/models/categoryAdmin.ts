import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { SlideCategory } from './slideCategory';
import { User } from './user';

const CategoryAdminDefinition = {
  categoryId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    references: {
      model: SlideCategory,
      key: 'id',
    },
  },
  adminId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
};

interface CategoryAdminAttributes {
  categoryId: string;
  adminId: string;
}

class CategoryAdmin extends Model<CategoryAdminAttributes> implements CategoryAdminAttributes {
  public categoryId!: string;
  public adminId!: string;
}

CategoryAdmin.init(CategoryAdminDefinition, {
  sequelize,
  tableName: 'category_management',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { CategoryAdmin };

import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { Course } from './course';
import { v4 as uuidv4 } from 'uuid';

const InventoryDefinition = {
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
  userId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  courseId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Course,
      key: 'id',
    },
  },
};

interface InventoryAttributes {
  id: string;
  gold: number;
  userId: string;
  courseId: string;
}

type InventoryCreationAttributes = Optional<InventoryAttributes, 'id'>;

class Inventory
  extends Model<InventoryAttributes, InventoryCreationAttributes>
  implements InventoryAttributes
{
  public id!: string;
  public gold!: number;
  public userId!: string;
  public courseId!: string;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

Inventory.init(InventoryDefinition, {
  sequelize,
  tableName: 'inventories',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  scopes: Inventory.scopes,
  validate: Inventory.validations,
});

export { Inventory };

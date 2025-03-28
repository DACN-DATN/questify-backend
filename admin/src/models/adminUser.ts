import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

enum AdminActionType {
    Suspend = 'suspend',
    EditInformation = 'editInformation',
}

const AdminUserDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  adminId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
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
  timestamp: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  reason: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  actionType: {
    allowNull: false,
    type: DataTypes.ENUM,
    values: Object.values(AdminActionType),
  },
};

interface AdminUserAttributes {
  id: string;
  adminId: string;   
  userId: string;    
  timestamp: Date;
  reason?: string;
  actionType: AdminActionType;
}

type AdminUserCreationAttributes = Optional<
  AdminUserAttributes,
  'id' | 'timestamp'
>;

class AdminUser
  extends Model<AdminUserAttributes, AdminUserCreationAttributes>
  implements AdminUserAttributes
{
  public id!: string;
  public adminId!: string;
  public userId!: string;
  public timestamp!: Date;
  public reason?: string;
  public actionType!: AdminActionType;

  static readonly scopes: ModelScopeOptions = {};
  static readonly validations: ModelValidateOptions = {};
}

AdminUser.init(AdminUserDefinition, {
  sequelize,
  tableName: 'admin_user_actions',
  underscored: true,
  createdAt: false,
  updatedAt: false,
  scopes: AdminUser.scopes,
  validate: AdminUser.validations,
  indexes: [
    {
      fields: ['action_type'],
    },
    {
      fields: ['admin_id'],
    },
    {
      fields: ['user_id'],
    },
    {
      fields: ['timestamp'],
    }
  ],
});

export { AdminUser };
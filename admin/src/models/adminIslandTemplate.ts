import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { IslandTemplate } from './islandTemplate';
import { v4 as uuidv4 } from 'uuid';

enum AdminIslandTemplateActionType {
    Add = 'add',
    Edit = 'edit',
    Remove = 'remove',
}

const AdminIslandTemplateDefinition = {
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
  islandTemplateId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: IslandTemplate,
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
    values: Object.values(AdminIslandTemplateActionType),
  },
};

interface AdminIslandTemplateAttributes {
  id: string;
  adminId: string;   
  islandTemplateId: string;    
  timestamp: Date;
  reason?: string;
  actionType: AdminIslandTemplateActionType;
}

type AdminIslandTemplateCreationAttributes = Optional<
  AdminIslandTemplateAttributes,
  'id' | 'timestamp'
>;

class AdminIslandTemplate
  extends Model<AdminIslandTemplateAttributes, AdminIslandTemplateCreationAttributes>
  implements AdminIslandTemplateAttributes
{
  public id!: string;
  public adminId!: string;
  public islandTemplateId!: string;
  public timestamp!: Date;
  public reason?: string;
  public actionType!: AdminIslandTemplateActionType;

  static readonly scopes: ModelScopeOptions = {};
  static readonly validations: ModelValidateOptions = {};
}

AdminIslandTemplate.init(AdminIslandTemplateDefinition, {
  sequelize,
  tableName: 'admin_island_template_actions',
  underscored: true,
  createdAt: false,
  updatedAt: false,
  scopes: AdminIslandTemplate.scopes,
  validate: AdminIslandTemplate.validations,
  indexes: [
    {
      fields: ['action_type'],
    },
    {
      fields: ['admin_id'],
    },
    {
      fields: ['island_template_id'],
    },
    {
      fields: ['timestamp'],
    }
  ],
});

export { AdminIslandTemplate };
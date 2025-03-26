import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { SlideTemplate } from './slideTemplate';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

const SlideTemplateAdminDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  slideTemplateId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    references: {
      model: SlideTemplate,
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

interface SlideTemplateAdminAttributes {
  id: string;
  slideTemplateId: string;
  adminId: string;
}

class SlideTemplateAdmin
  extends Model<SlideTemplateAdminAttributes>
  implements SlideTemplateAdminAttributes
{
  public id!: string;
  public slideTemplateId!: string;
  public adminId!: string;
}

SlideTemplateAdmin.init(SlideTemplateAdminDefinition, {
  sequelize,
  tableName: 'slide_template_admin',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { SlideTemplateAdmin };

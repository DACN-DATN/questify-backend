import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { Course } from './course';
import { v4 as uuidv4 } from 'uuid';

enum AdminCourseActionType {
    Reject = 'reject',
    Approve = 'approve',
}

const AdminCourseDefinition = {
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
  courseId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Course,
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
    values: Object.values(AdminCourseActionType),
  },
};

interface AdminCourseAttributes {
  id: string;
  adminId: string;   
  courseId: string;    
  timestamp: Date;
  reason?: string;
  actionType: AdminCourseActionType;
}

type AdminCourseCreationAttributes = Optional<
  AdminCourseAttributes,
  'id' | 'timestamp'
>;

class AdminCourse
  extends Model<AdminCourseAttributes, AdminCourseCreationAttributes>
  implements AdminCourseAttributes
{
  public id!: string;
  public adminId!: string;
  public courseId!: string;
  public timestamp!: Date;
  public reason?: string;
  public actionType!: AdminCourseActionType;

  static readonly scopes: ModelScopeOptions = {};
  static readonly validations: ModelValidateOptions = {};
}

AdminCourse.init(AdminCourseDefinition, {
  sequelize,
  tableName: 'admin_course_actions',
  underscored: true,
  createdAt: false,
  updatedAt: false,
  scopes: AdminCourse.scopes,
  validate: AdminCourse.validations,
  indexes: [
    {
      fields: ['action_type'],
    },
    {
      fields: ['admin_id'],
    },
    {
      fields: ['course_id'],
    },
    {
      fields: ['timestamp'],
    }
  ],
});

export { AdminCourse };
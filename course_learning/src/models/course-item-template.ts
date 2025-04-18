import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { Course } from './course';
import { ItemTemplate } from './item-template';

const CourseItemTemplateDefinition = {
  courseId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Course,
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

interface CourseItemTemplateAttributes {
  courseId: string;
  itemTemplateId: string;
}

type CourseItemTemplateCreationAttributes = Optional<
  CourseItemTemplateAttributes,
  'courseId' | 'itemTemplateId'
>;

class CourseItemTemplate
  extends Model<CourseItemTemplateAttributes, CourseItemTemplateCreationAttributes>
  implements CourseItemTemplateAttributes
{
  public courseId!: string;
  public itemTemplateId!: string;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

CourseItemTemplate.init(CourseItemTemplateDefinition, {
  sequelize,
  tableName: 'course_item_templates',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  scopes: CourseItemTemplate.scopes,
  validate: CourseItemTemplate.validations,
});

export { CourseItemTemplate };

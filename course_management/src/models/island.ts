import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { Course } from './course';
import { Level } from './level';
import { PrerequisiteIsland } from './prerequisiteIsland';

const IslandDefinition = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  position: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  backgroundImage: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  courseId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Course,
      key: 'id',
    },
    validate: {
      isUUID: 4,
    },
  },
};

interface IslandAttributes {
  id: string;
  name: string;
  description?: string;
  position: number;
  backgroundImage?: string;
  courseId: string;
}

interface IslandCreationAttributes extends Optional<IslandAttributes, 'id'> {}

class Island extends Model<IslandAttributes, IslandCreationAttributes> implements IslandAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public position!: number;
  public backgroundImage?: string;
  public courseId!: string;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

Island.init(IslandDefinition, {
  sequelize,
  tableName: 'islands',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  scopes: Island.scopes,
  validate: Island.validations,
});

Island.belongsTo(Course, { foreignKey: 'courseId' });
Island.hasMany(Level, { foreignKey: 'islandId' });
Island.belongsToMany(Island, {
  through: PrerequisiteIsland,
  foreignKey: 'islandId',
  otherKey: 'prerequisiteIslandId',
  as: 'prerequisites',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Island.belongsToMany(Island, {
  through: PrerequisiteIsland,
  foreignKey: 'prerequisiteIslandId',
  otherKey: 'islandId',
  as: 'islandsThatArePrerequisites',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export { Island };

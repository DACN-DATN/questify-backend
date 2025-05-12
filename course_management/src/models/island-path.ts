// src/models/island-path.ts
import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { IslandPathType } from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';

const IslandPathDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  type: {
    allowNull: false,
    type: DataTypes.ENUM(...Object.values(IslandPathType)),
    defaultValue: IslandPathType.ForestPath,
  },
  isDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedAt: {
    allowNull: true,
    type: DataTypes.DATE,
  },
};

interface IslandPathAttributes {
  id: string;
  type: IslandPathType;
  isDeleted: boolean;
  deletedAt?: Date;
}

type IslandPathCreationAttributes = Optional<
  IslandPathAttributes,
  'id' | 'isDeleted' | 'deletedAt'
>;

class IslandPath
  extends Model<IslandPathAttributes, IslandPathCreationAttributes>
  implements IslandPathAttributes
{
  public id!: string;
  public type!: IslandPathType;
  public isDeleted!: boolean;
  public deletedAt?: Date;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

IslandPath.init(IslandPathDefinition, {
  sequelize,
  tableName: 'island_paths',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: IslandPath.scopes,
  validate: IslandPath.validations,
});

export { IslandPath };
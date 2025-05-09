import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { Level } from './level';
import { v4 as uuidv4 } from 'uuid';

const CodeProblemDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  levelId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Level,
      key: 'id',
    },
  },
  description: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  isDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

interface CodeProblemAttributes {
  id: string;
  levelId: string;
  description?: string;
  isDeleted: boolean;
}

type CodeProblemCreationAttributes = Optional<CodeProblemAttributes, 'id' | 'isDeleted'>;

class CodeProblem
  extends Model<CodeProblemAttributes, CodeProblemCreationAttributes>
  implements CodeProblemAttributes
{
  public id!: string;
  public levelId!: string;
  public description?: string;
  public isDeleted!: boolean;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

CodeProblem.init(CodeProblemDefinition, {
  sequelize,
  tableName: 'code_problems',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: CodeProblem.scopes,
  validate: CodeProblem.validations,
});

export { CodeProblem };

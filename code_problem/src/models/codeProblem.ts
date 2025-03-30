import { Model, DataTypes, Optional } from 'sequelize';
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
    type: DataTypes.STRING,
  },
};

interface CodeProblemAttributes {
  id: string;
  levelId: string;
  description: string;
}

type CodeProblemCreationAttributes = Optional<CodeProblemAttributes, 'id'>;

class CodeProblem
  extends Model<CodeProblemAttributes, CodeProblemCreationAttributes>
  implements CodeProblemAttributes
{
  public id!: string;
  public levelId!: string;
  public description!: string;
}

CodeProblem.init(CodeProblemDefinition, {
  sequelize,
  tableName: 'code_problems',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { CodeProblem };

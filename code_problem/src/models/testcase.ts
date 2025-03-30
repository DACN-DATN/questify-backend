import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { CodeProblem } from './codeProblem';
import { v4 as uuidv4 } from 'uuid';

const TestcaseDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  codeProblemId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: CodeProblem,
      key: 'id',
    },
  },
  input: {
    allowNull: true,
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  output: {
    allowNull: true,
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  explaination: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  isShowed: {
    allowNull: true,
    type: DataTypes.BOOLEAN,
  },
};

interface TestcaseAttributes {
  id: string;
  codeProblemId: string;
  input?: string[];
  output?: string[];
  explaination?: string;
  isShowed?: boolean;
}

type TestcaseCreationAttributes = Optional<TestcaseAttributes, 'id'>;

class Testcase
  extends Model<TestcaseAttributes, TestcaseCreationAttributes>
  implements TestcaseAttributes
{
  public id!: string;
  public codeProblemId!: string;
  public input?: string[];
  public output?: string[];
  public explaination?: string;
  public isShowed?: boolean;
}

Testcase.init(TestcaseDefinition, {
  sequelize,
  tableName: 'testcases',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { Testcase };

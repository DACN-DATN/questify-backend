import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { CodeProblem } from './code-problem';
import { v4 as uuidv4 } from 'uuid';
import { EnvStage } from '@datn242/questify-common';

const isTest = process.env.NODE_ENV === EnvStage.Test;

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
    allowNull: false,
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  output: {
    allowNull: false,
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  isShowed: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
  },
  isDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

interface TestcaseAttributes {
  id: string;
  codeProblemId: string;
  input: string | string[];
  output: string | string[];
  isShowed: boolean;
  isDeleted: boolean;
}

type TestcaseCreationAttributes = Optional<TestcaseAttributes, 'id' | 'isDeleted'>;

class Testcase
  extends Model<TestcaseAttributes, TestcaseCreationAttributes>
  implements TestcaseAttributes
{
  public id!: string;
  public codeProblemId!: string;
  public input!: string | string[];
  public output!: string | string[];
  public isShowed!: boolean;
  public isDeleted!: boolean;
}

Testcase.init(TestcaseDefinition, {
  sequelize,
  tableName: 'testcases',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

Testcase.init(
  {
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
      field: 'code_problem_id',
    },
    input: {
      type: isTest ? DataTypes.TEXT : DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      get() {
        const value = this.getDataValue('input');
        if (isTest && typeof value === 'string') {
          try {
            return JSON.parse(value || '[]');
          } catch (e) {
            console.error('Error parsing input:', e);
            return [];
          }
        }
        return value as string | string[]; // Explicitly cast to string | string[]
      },
      set(value: string | string[]) {
        if (isTest && Array.isArray(value)) {
          this.setDataValue('input', JSON.stringify(value));
        } else if (isTest && typeof value === 'string') {
          this.setDataValue('input', value);
        } else {
          this.setDataValue('input', value);
        }
      },
    },
    output: {
      type: isTest ? DataTypes.TEXT : DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      get() {
        const value = this.getDataValue('output');
        if (isTest && typeof value === 'string') {
          try {
            return JSON.parse(value || '[]');
          } catch (e) {
            console.log('Error parsing output:', e);
            return [];
          }
        }
        return value as string | string[]; // Explicitly cast to string | string[]
      },
      set(value: string | string[]) {
        if (isTest && Array.isArray(value)) {
          this.setDataValue('output', JSON.stringify(value));
        } else if (isTest && typeof value === 'string') {
          this.setDataValue('output', value);
        } else {
          this.setDataValue('output', value);
        }
      },
    },
    isShowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_showed',
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_deleted',
    },
  },
  {
    sequelize,
    tableName: 'testcases',
    underscored: true,
    timestamps: true,
  },
);

export { Testcase };

import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  requireAuth,
  UserRole,
  NotAuthorizedError,
  BadRequestError,
  ResourcePrefix,
} from '@datn242/questify-common';
import { Level } from '../../models/level';
import { Testcase } from '../../models/testcase';
import { DataType, DataTypes } from 'sequelize';
import { CodeProblem } from '../../models/code-problem';
import { parseValue, parseInputString } from '../../service/assessment.srv';

interface TestcaseInput {
  input: string;
  output: string;
  hidden: boolean;
}

const router = express.Router();

router.post(
  ResourcePrefix.CodeProblem + '/:code_problem_id/assessment',
  requireAuth,
  [body('userCode').isString().withMessage('userCode must be a string')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code_problem_id } = req.params;
    const { userCode } = req.body;

    const codeProblem = await CodeProblem.findByPk(code_problem_id);

    if (!codeProblem) {
      throw new BadRequestError('Code Problem not found');
    }

    const testcasesResponse = await Testcase.findAll({
      where: {
        codeProblemId: codeProblem.id,
      },
    });

    if (testcasesResponse.length === 0) {
      throw new BadRequestError('No testcases found for this code problem');
    }

    // const testcaseResponse = mockTestcase;
    const testcases = testcasesResponse.map((testcase) => {
      return {
        input: testcase.input,
        output: testcase.output,
        hidden: testcase.hidden,
      };
    });
    // const mockCode = mockUserCode;

    const cb = new Function(`return ${userCode}`)();
    // const cb = new Function(`return ${userCode || mockCode}`)();

    const results = [];

    for (const testcase of testcases) {
      try {
        const inputParams = parseInputString(testcase.input);
        console.log('inputParams', inputParams);
        const result = cb(...inputParams);
        const expectedOutput = JSON.parse(testcase.output);
        const passed = JSON.stringify(result) === JSON.stringify(expectedOutput);

        results.push({
          input: testcase.input,
          expectedOutput: testcase.output,
          actualOutput: JSON.stringify(result),
          passed,
          hidden: testcase.hidden,
        });
      } catch (error: unknown) {
        results.push({
          input: testcase.input,
          expectedOutput: testcase.output,
          error: error instanceof Error ? error.message : 'Unknown error',
          passed: false,
          hidden: testcase.hidden,
        });
      }
    }

    const allPassed = results.every((r) => r.passed);
    const visibleResults = results.filter((r) => !r.hidden);
    const resultObj = {
      success: allPassed,
      results: visibleResults,
      totalTestcases: testcases.length,
      passedTestcases: results.filter((r) => r.passed).length,
    };
    console.log(resultObj);

    res.status(200).send(resultObj);
  },
);

export { router as assessCodeProblemRouter };

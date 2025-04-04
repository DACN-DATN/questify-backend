import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { CodeProblem } from '../../models/code-problem';
import { Testcase } from '../../models/testcase';
import { validateRequest, requireAuth, UserRole, NotAuthorizedError, BadRequestError, ResourcePrefix } from '@datn242/questify-common';

const router = express.Router();

router.post(
  ResourcePrefix.CodeProblem + '/:code_problem_id/testcases',
  requireAuth,
  [
    body('testcases')
      .isArray({ min: 1 })
      .withMessage('testcases must be a non-empty array')
      .custom((arr) =>
        arr.every(
          (item: any) =>
            typeof item.input === 'object' &&
            Array.isArray(item.input) &&
            item.input.every((inputItem: any) => typeof inputItem === 'string') &&
            typeof item.output === 'object' &&
            Array.isArray(item.output) &&
            item.output.every((outputItem: any) => typeof outputItem === 'string') &&
            typeof item.isShowed === 'boolean'
        )
      )
      .withMessage(
        'Each testcase must have input (array of strings), output (array of strings), and isShowed (boolean)'
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code_problem_id } = req.params;
    const { testcases } = req.body;

    if (req.currentUser!.role !== UserRole.Teacher) {
      throw new NotAuthorizedError();
    }

    const code_problem = await CodeProblem.findByPk(code_problem_id);
    if (!code_problem) {
      throw new BadRequestError('Code Problem not found');
    }

    const formattedTestcases = testcases.map((testcase: any) => ({
      codeProblemId: code_problem.id,
      input: testcase.input,
      output: testcase.output,
      isShowed: testcase.isShowed,
    }));

    const createdTestcases = await Testcase.bulkCreate(formattedTestcases);

    res.status(201).send(createdTestcases);
  },
);

export { router as createTestcaseRouter };

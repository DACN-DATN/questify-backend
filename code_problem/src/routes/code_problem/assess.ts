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

interface TestcaseInput {
  input: string[];
  output: string[];
  hidden: boolean;
}

const router = express.Router();

router.post(
  ResourcePrefix.CodeProblem + '/:code_problem_id/assessment',
  requireAuth,
  [
    body('level_id')
      .exists()
      .withMessage('level_id is required')
      .isUUID()
      .withMessage('level_id must be a valid UUID'),
    body('id').optional().isUUID().withMessage('id must be a valid UUID'),
    body('description').isString().withMessage('description must be a string'),
    body('parameters').optional().isArray().withMessage('parameters must be an array'),
    body('returnType').optional().isObject().withMessage('returnType must be an object'),
    body('starterCode').isString().withMessage('starterCode must be a string'),
    body('testcases').optional().isArray().withMessage('testcases must be an array'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code_problem_id } = req.params;
    const { level_id, id, description, parameters = [], returnType = {}, starterCode } = req.body;

    const codeProblem = await CodeProblem.findByPk(code_problem_id);

    if (!codeProblem) {
      throw new BadRequestError('Code Problem not found');
    }

    const testcases = await Testcase.findAll({
      where: {
        codeProblemId: codeProblem.id,
      },
    });

    if (testcases.length === 0) {
      throw new BadRequestError('No testcases found for this code problem');
    }



    res.status(200).send();
  },
);

export { router as assessCodeProblemRouter };

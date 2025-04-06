import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { CodeProblem } from '../../models/code-problem';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  ResourcePrefix,
  validateRequest,
} from '@datn242/questify-common';
import { Level } from '../../models/level';
import { Testcase } from '../../models/testcase';
import { findByPkWithSoftDelete } from '../../utils/model';

const router = express.Router();

router.patch(
  ResourcePrefix.CodeProblem + '/:code_problem_id/testcases/:testcase_id',
  requireAuth,
  [
    body('input').isString().withMessage('input must be a string'),
    body('output').isString().withMessage('output must be a string'),
    body('isShowed').isBoolean().withMessage('isShowed must be a boolean'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code_problem_id, testcase_id } = req.params;
    const code_problem = await findByPkWithSoftDelete(CodeProblem, code_problem_id);

    if (!code_problem) {
      throw new NotFoundError();
    }

    const level = await findByPkWithSoftDelete(Level, code_problem.levelId);

    if (!level) {
      throw new NotFoundError();
    }

    if (level.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const testcase = await findByPkWithSoftDelete(Testcase, testcase_id, {
      codeProblemId: code_problem_id,
    });

    if (!testcase) {
      throw new NotFoundError();
    }

    const updateFields: Partial<Testcase> = {};
    const { input, output, isShowed } = req.body;

    if (input !== undefined) updateFields['input'] = input;
    if (output !== undefined) updateFields['output'] = output;
    if (isShowed !== undefined) updateFields['isShowed'] = isShowed;
    testcase.set(updateFields);

    await testcase.save();
    res.status(201).send(testcase);
  },
);

export { router as updateTestcaseRouter };

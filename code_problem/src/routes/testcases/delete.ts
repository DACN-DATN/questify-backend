import express, { Request, Response } from 'express';
import { CodeProblem } from '../../models/code-problem';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  ResourcePrefix,
} from '@datn242/questify-common';
import { Level } from '../../models/level';
import { Testcase } from '../../models/testcase';

const router = express.Router();

router.delete(
  ResourcePrefix.CodeProblem + '/:code_problem_id/testcases/:testcase_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { code_problem_id, testcase_id } = req.params;
    const code_problem = await CodeProblem.findByPk(code_problem_id);

    if (!code_problem) {
      throw new NotFoundError();
    }

    const level = await Level.findByPk(code_problem.levelId);

    if (!level) {
      throw new NotFoundError();
    }

    if (level.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const testcase = await Testcase.findOne({
      where: {
        codeProblemId: code_problem_id,
        id: testcase_id,
      }
    })

    if (!testcase) {
      throw new NotFoundError();
    }

    await Testcase.softDelete({
      id: testcase.id,
      code_problem_id: testcase.codeProblemId,
    });
    res.status(201).send('Delete Successfully');
  },
);

export { router as deleteTestcaseRouter };

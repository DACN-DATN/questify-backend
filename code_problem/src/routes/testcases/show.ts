import express, { Request, Response } from 'express';
import { NotFoundError, ResourcePrefix } from '@datn242/questify-common';
import { Testcase } from '../../models/testcase';
import { findByPkWithSoftDelete } from '../../utils/model';

const router = express.Router();

router.get(
  ResourcePrefix.CodeProblem + '/:code_problem_id/testcases/:testcase_id',
  async (req: Request, res: Response) => {
    const { code_problem_id, testcase_id } = req.params;
    const testcase = await findByPkWithSoftDelete(Testcase, testcase_id, {
      codeProblemId: code_problem_id,
    });

    if (!testcase) {
      throw new NotFoundError();
    }

    res.send(testcase);
  },
);

export { router as showTestcaseRouter };

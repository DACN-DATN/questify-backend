import express, { Request, Response } from 'express';
import { CodeProblem } from '../../models/code-problem';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  ResourcePrefix,
} from '@datn242/questify-common';
import { Level } from '../../models/level';
import { where } from 'sequelize';

const router = express.Router();

router.delete(
  ResourcePrefix.CodeProblem + '/:code_problem_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { code_problem_id } = req.params;
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

    await CodeProblem.softDelete({ id: code_problem.id },);
    res.status(201).send('Delete Successfully');
  },
);

export { router as deleteCodeProblemRouter };

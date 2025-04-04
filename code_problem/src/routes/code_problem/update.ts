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
import { findByPkWithSoftDelete } from '../../utils/model';

const router = express.Router();

router.patch(
  ResourcePrefix.CodeProblem + '/:code_problem_id',
  requireAuth,
  [body('description').isString().withMessage('description must be a string')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code_problem_id } = req.params;
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

    const updateFields: Partial<CodeProblem> = {};
    const { description } = req.body;

    if (description !== undefined) updateFields['description'] = description;
    code_problem.set(updateFields);

    await code_problem.save();
    res.status(201).send(code_problem);
  },
);

export { router as updateCodeProblemRouter };

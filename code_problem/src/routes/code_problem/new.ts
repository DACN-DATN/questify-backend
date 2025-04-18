import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { CodeProblem } from '../../models/code-problem';
import {
  validateRequest,
  requireAuth,
  UserRole,
  NotAuthorizedError,
  BadRequestError,
  ResourcePrefix,
} from '@datn242/questify-common';
import { Level } from '../../models/level';
import { findByPkWithSoftDelete } from '../../utils/model';

const router = express.Router();

router.post(
  ResourcePrefix.CodeProblem,
  requireAuth,
  [
    body('level_id')
      .exists()
      .withMessage('level_id is required')
      .isUUID()
      .withMessage('level_id must be a valid UUID'),
    body('description').isString().withMessage('description must be a string'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { level_id, description } = req.body;

    if (req.currentUser!.role !== UserRole.Teacher) {
      throw new NotAuthorizedError();
    }

    const level = await findByPkWithSoftDelete(Level, level_id);
    if (!level) {
      throw new BadRequestError('Level not found');
    }

    if (level.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const code_problem = await CodeProblem.create({
      levelId: level.id,
      description: description,
    });

    res.status(201).send(code_problem);
  },
);

export { router as createCodeProblemRouter };

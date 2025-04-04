import express, { Request, Response } from 'express';
import { NotFoundError, ResourcePrefix } from '@datn242/questify-common';
import { Attempt } from '../../models/attempt';

const router = express.Router();

router.get(
  ResourcePrefix.CodeProblem + '/attempts/:attempt_id',
  async (req: Request, res: Response) => {
    const { attempt_id } = req.params;
    const attempt = await Attempt.findByPk(attempt_id);

    if (!attempt) {
      throw new NotFoundError();
    }

    res.send(attempt);
  },
);

export { router as showAttemptRouter };

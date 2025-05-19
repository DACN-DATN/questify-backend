import express from 'express';
import { LevelService } from '../services/level';

import { currentUser } from '@datn242/questify-common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({
    currentUser: req.currentUser || null,
    levelInfo: LevelService.getInstance().getLevelInfo(req.currentUser?.userExp || 0),
  });
});

export { router as currentUserRouter };

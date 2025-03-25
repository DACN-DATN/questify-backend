import express from 'express';

import { currentUser } from '@datn242/questify-common';
import { User } from '../models/user';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, async (req, res) => {
  let user = req.currentUser;
  if (user) {
    const response = await User.findOne({ _id: user.id });
    if (response) {
      res.send({ currentUser: response });
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  } else {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };

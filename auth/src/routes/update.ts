import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
} from '@datn242/questify-common';
import { User } from '../models/user';

const router = express.Router();

router.patch(
  '/api/users/:user_id',
  requireAuth,
  [
    body('userName')
      .optional()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),
    body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
    body().custom((body) => {
      if (!body.userName && !body.imageUrl) {
        throw new Error('You must provide either userName or imageUrl to update');
      }
      return true;
    }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { userName, imageUrl } = req.body;
    const currentUserId = req.currentUser!.id;

    if (currentUserId !== user_id) {
      throw new NotAuthorizedError();
    }

    const user = await User.findOne({ _id: user_id });

    if (!user) {
      throw new NotFoundError();
    }

    // Check if username is taken if user is changing it
    if (userName && userName !== user.userName) {
      const existingUsername = await User.findOne({ userName });
      if (existingUsername && existingUsername._id !== user_id) {
        throw new BadRequestError('Username is already in use');
      }
      user.userName = userName;
    }

    // Update image URL if provided
    if (imageUrl) {
      user.imageUrl = imageUrl;
    }

    await user.save();

    res.status(200).send(user);
  },
);

export { router as updateProfileRouter };

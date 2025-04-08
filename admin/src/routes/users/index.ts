import express, { Request, Response } from 'express';
import { 
  requireAuth, 
  validateRole,
  UserRole 
} from '@datn242/questify-common';
import { User } from '../../models/user';

const router = express.Router();

/**
 * GET /api/admin/users
 * List all users in the system
 * Requires admin authentication
 */
router.get(
  '/api/admin/users',
  requireAuth,
  validateRole([UserRole.Admin]),
  async (req: Request, res: Response) => {
    // Find all users
    const users = await User.findAll({
      order: [['createdAt', 'DESC']], // Newest first
      attributes: { 
        exclude: ['deletedAt'] // Exclude unnecessary fields
      }
    });

    res.status(200).send(users);
  }
);

export { router as indexUserRouter };
import { Router } from 'express';
import { getMyProfile } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// To protect this route, we simply add the 'protect' middleware before the controller.
// The request flow will be: Request -> protect() -> getMyProfile()
router.get('/profile', protect, getMyProfile);

export default router;

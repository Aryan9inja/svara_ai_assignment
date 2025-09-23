import {Router} from 'express';
import * as authController from '../controllers/auth.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getCurrent);

export default router;
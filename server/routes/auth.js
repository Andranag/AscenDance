import express from 'express';
import { login, register, updateProfile, getProfile } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', authLimiter, login);
router.post('/register', authLimiter, register);
router.put('/profile', auth, authLimiter, updateProfile);
router.get('/profile', auth, getProfile);

export default router;
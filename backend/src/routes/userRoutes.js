const express = require('express');
const router = express.Router();
const { 
  login, 
  registerUser, 
  getUserProfileById, 
  getAllUsers, 
  updateUserProfile,
  validateToken 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Create rate limiter instance
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Maximum 50 attempts per IP per 5 minutes
  message: 'Too many login attempts. Please try again in 5 minutes.',
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes
router.post('/login', loginLimiter, login);
router.post('/register', loginLimiter, registerUser);
router.get('/verify', validateToken);

// Protected routes
router.get('/', protect, getUserProfileById);
router.get('/:id', protect, getUserProfileById);
router.put('/profile', protect, updateUserProfile);
router.get('/users', protect, authorize(['admin']), getAllUsers);

module.exports = router;

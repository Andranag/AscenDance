const express = require('express');
const router = express.Router();
const { getUserProfileById, getAllUsers, updateUserProfile } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get user profile by ID
router.get('/:id', protect, getUserProfileById);

// Get current user profile
router.get('/', protect, getUserProfileById);

// Update user profile
router.put('/profile', protect, updateUserProfile);

// Admin-only user management routes
router.get('/users', protect, authorize(['admin']), getAllUsers);

// Verify token
router.get('/verify', protect, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;

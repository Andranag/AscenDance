const express = require('express');
const router = express.Router();
const { getUserProfile, getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Profile route (protected) - by ID
router.get('/profile/:id', protect, getUserProfile);

// Profile route (protected) - current user
router.get('/profile', protect, getUserProfile);

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

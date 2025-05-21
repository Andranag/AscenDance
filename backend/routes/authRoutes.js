const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Verify token
router.get('/verify', auth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
});

module.exports = router;

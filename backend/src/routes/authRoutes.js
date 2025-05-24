const express = require('express');
const router = express.Router();
const { loginUser, registerUser, validateToken } = require('../controllers/userController');

// Public routes
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/verify', validateToken);

module.exports = router;

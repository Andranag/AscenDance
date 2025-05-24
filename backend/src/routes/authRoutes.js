const express = require('express');
const router = express.Router();
const { login, registerUser, validateToken } = require('../controllers/userController');

// Public routes
router.post('/login', login);
router.post('/register', registerUser);
router.get('/verify', validateToken);

module.exports = router;

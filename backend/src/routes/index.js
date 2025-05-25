const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/courses', courseRoutes);

module.exports = router;

const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const adminRoutes = require('./adminRoutes');

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/courses', courseRoutes);
router.use('/admin', adminRoutes);

module.exports = router;

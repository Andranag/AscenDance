const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const adminRoutes = require('./adminRoutes');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/admin', adminRoutes);

module.exports = router;

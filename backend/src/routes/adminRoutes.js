const express = require('express');
const { getAllCoursesAdmin, createCourse, updateCourse, deleteCourse } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes are protected
router.use(protect, isAdmin);

// Course management routes
router.get('/courses', getAllCoursesAdmin);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

module.exports = router;

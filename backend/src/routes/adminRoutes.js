const express = require('express');
const {
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(isAdmin);

// Courses
router.get('/courses', getAllCoursesAdmin);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;

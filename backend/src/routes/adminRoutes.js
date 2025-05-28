const express = require('express');
const {
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllUsers,
  updateUser,
  updateUserRole,
  deleteUser
} = require('../controllers/adminController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(isAdmin);

router.get('/courses', getAllCoursesAdmin);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;

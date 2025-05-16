const express = require('express');
const {
  addClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
} = require('../controllers/classController');
const { authMiddleware, adminAccess } = require('../middleware/authMiddleware')
const router = express.Router();

router.post('/', authMiddleware,adminAccess, addClass);
router.get('/', authMiddleware, getAllClasses);
router.get('/:id',authMiddleware, getClassById);
router.put('/:id', authMiddleware,adminAccess, updateClass);
router.delete('/:id', authMiddleware,adminAccess, deleteClass);

module.exports = router;

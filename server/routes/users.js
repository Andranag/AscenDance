import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser,
  updateUser, 
  deleteUser, 
  toggleUserRole 
} from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.use(auth);

// Create user
router.post('/', createUser);

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Toggle user role
router.patch('/:id/toggle-role', toggleUserRole);

export const userRoutes = router;

import User from '../models/User.js';
import { NotFoundError, ValidationError, AuthenticationError, successResponse, errorResponse } from '../utils/errorUtils.js';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.js';

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      throw new ValidationError('Name, email, and password are required');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError('This email is already registered. Please use a different email address.');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await user.save();
    logger.info('User created successfully', { userId: user._id });
    return successResponse(res, user, 'User created successfully', 201);
  } catch (error) {
    logger.error('Error creating user', error);
    return errorResponse(res, error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return successResponse(res, users);
  } catch (error) {
    return errorResponse(res, error);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    logger.info('User retrieved successfully', { userId: req.params.id });
    return successResponse(res, user);
  } catch (error) {
    logger.error('Error getting user', error);
    return errorResponse(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    console.log('Update user request:', {
      userId: req.params.id,
      updateData: req.body
    });

    const { password, ...updateData } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // If password is provided, hash it
    if (password) {
      try {
        console.log('Hashing password for user:', req.params.id);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateData.password = hashedPassword;
      } catch (hashError) {
        console.error('Password hashing error:', hashError);
        return errorResponse(res, new Error('Failed to hash password'));
      }
    }

    // Update user
    try {
      Object.assign(user, updateData);
      await user.save();
      console.log('User updated successfully:', {
        userId: user._id,
        updatedFields: Object.keys(updateData)
      });
      return successResponse(res, {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        updatedFields: Object.keys(updateData)
      }, 'User updated successfully');
    } catch (saveError) {
      console.error('Error saving user:', {
        userId: req.params.id,
        error: saveError
      });
      throw saveError;
    }
  } catch (error) {
    console.error('Update user error:', {
      userId: req.params.id,
      error: error
    });
    return errorResponse(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    logger.info('User deleted successfully', { userId: req.params.id });
    return successResponse(res, user, 'User deleted successfully');
  } catch (error) {
    logger.error('Error deleting user', error);
    return errorResponse(res, error);
  }
};

const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.role = user.role === 'user' ? 'admin' : 'user';
    await user.save();
    logger.info('User role toggled successfully', { userId: req.params.id, newRole: user.role });
    return successResponse(res, user, 'User role toggled successfully');
  } catch (error) {
    logger.error('Error toggling user role', error);
    return errorResponse(res, error);
  }
};

export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserRole
};
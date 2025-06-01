import { 
  successResponse, 
  errorResponse,
  AuthenticationError,
  ConflictError,
  generateToken,
} from '../utils/errorUtils.js';
import { logger } from '../utils/logger.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AuthenticationError('Invalid credentials');
    }

    logger.info('User logged in successfully', { userId: user._id });
    const token = generateToken(user);
    return successResponse(res, { token, user: { id: user._id, email: user.email, role: user.role } }, 'Login successful');
  } catch (error) {
    logger.error('Error logging in', error);
    return errorResponse(res, error);
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      throw new ValidationError('Required fields are missing', [
        'Name is required',
        'Email is required',
        'Password is required'
      ]);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: USER_ROLES.USER
    });

    await user.save();

    const token = generateToken(user);

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, 'Registration successful', 201);
  } catch (error) {
    logger.error('Error registering user', error);
    return errorResponse(res, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.password;
    
    // Only allow admins to update role
    if (req.user.role !== 'admin' && updates.role) {
      throw new AuthenticationError('Only admins can update user roles');
    }
    delete updates.role;

    // Find and update user
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update specific fields
    if (updates.name) user.name = updates.name;
    if (updates.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new ConflictError('Email already in use');
      }
      user.email = updates.email;
    }

    // Save changes
    await user.save();
    logger.info('User profile updated successfully', { userId });

    // Return updated user without password
    const updatedUser = await User.findById(userId).select('-password');
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return successResponse(res, {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    }, 'User profile updated successfully');
  } catch (error) {
    logger.error('Error updating profile', error);
    return errorResponse(res, error);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return successResponse(res, user);
  } catch (error) {
    logger.error('Error getting profile', error);
    return errorResponse(res, error);
  }
};

export {
  login,
  register,
  getProfile,
  updateProfile
};
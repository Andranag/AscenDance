import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { 
  ValidationError, 
  AuthenticationError,
  successResponse,
  errorResponse
} from '../utils/errorUtils.js';
import { USER_ROLES, JWT_CONFIG } from '../utils/constants.js';

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

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRES_IN }
    );

    return successResponse(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    }, 'Login successful');
  } catch (error) {
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

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRES_IN }
    );

    return successResponse(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    }, 'Registration successful', 201);
  } catch (error) {
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
    return errorResponse(res, error);
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return successResponse(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

export {
  login,
  register,
  getProfile,
  updateProfile
};
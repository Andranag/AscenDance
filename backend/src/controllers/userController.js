const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists',
        error: 'user_exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user'  // Set default role for new users
    });

    // Create JWT token using the same method as authMiddleware
    const token = await generateToken(user._id.toString());

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: 'server_error'
    });
  }
};

const { protect, generateToken } = require('../middleware/authMiddleware');

const login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email }).select('id name email role password');
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ 
        message: 'Invalid credentials',
        error: 'user_not_found'
      });
    }
    console.log('Found user:', user);
    console.log('User role:', user.role);

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        error: 'invalid_password'
      });
    }

    // Create response objects
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Generate token
    const token = jwt.sign({
      id: user._id.toString(),
      role: user.role
    }, 'ascendance-secret-key-2025', { 
      expiresIn: '7d',
      algorithm: 'HS256'
    });

    // Send response
    res.status(200).json({
      success: true,
      data: {
        token,
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: 'server_error'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'user_not_found'
      });
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: 'server_error'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;
    console.log('Updating profile for user:', userId);
    
    const user = await User.findById(userId);
    
    if (!user) {
      console.error('User not found for ID:', userId);
      return res.status(404).json({ 
        message: 'User not found',
        error: 'user_not_found'
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    
    const updatedUser = await user.save();
    
    res.json({
      success: true,
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

// Helper to build user response
const formatUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role
});

// Error handler
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ message: error.message || 'Internal server error', error: error.name || 'server_error' });
};

// Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required', error: 'missing_fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists', error: 'email_taken' });
    }

    const user = await User.create({ name, email, password, role: 'user' });

    try {
      const token = generateToken(user);
      return res.json({
        success: true,
        data: {
          token,
          user: formatUser(user)
        }
      });
    } catch (tokenError) {
      await User.findByIdAndDelete(user._id); // Rollback
      throw new Error('Failed to generate token');
    }
  } catch (error) {
    handleError(res, error);
  }
}

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Generate token and return success response
      try {
        const token = generateToken(user);
        return res.json({
          token,
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || 'user'
          }
        });
      } catch (tokenError) {
        console.error('Token generation failed:', tokenError);
        return res.status(500).json({
          error: 'Failed to generate token'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        error: 'Internal server error'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }
    handleError(res, error);
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found', error: 'user_not_found' });
    }
    res.json({ success: true, data: formatUser(user) });
  } catch (error) {
    handleError(res, error);
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found', error: 'user_not_found' });
    }

    // Default role correction
    if (!user.role || user.role === 'student') {
      user.role = 'user';
    }

    if (name) user.name = name;
    if (email) user.email = email;

    // Only admin can update role (optional)
    if (req.user.role === 'admin' && req.body.role) {
      const validRoles = ['user', 'admin'];
      if (validRoles.includes(req.body.role)) {
        user.role = req.body.role;
      }
    }

    await user.save();
    res.json({ success: true, data: formatUser(user) });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: 'server_error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};

const User = require('../models/User');
const bcrypt = require('bcryptjs');

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
      password
    });

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

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
    
    const user = await User.findOne({ email });
    console.log('Found user:', user ? 'yes' : 'no');
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ 
        message: 'Invalid credentials',
        error: 'user_not_found'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ 
        message: 'Invalid credentials',
        error: 'invalid_password'
      });
    }

    // Create JWT token using the same method as authMiddleware
    const token = generateToken(user._id);
    console.log('Generated token:', token);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
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

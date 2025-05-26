const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/authMiddleware');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'All fields are required',
        error: 'missing_fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists',
        error: 'user_exists'
      });
    }

    // Create user with default role 'user'
    const user = await User.create({
      name,
      email,
      password,
      role: 'user'
    });

    try {
      // Create JWT token using the same method as authMiddleware
      const token = await generateToken(user._id.toString());
      
      console.log('Successfully created token for user:', user._id);
      
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (tokenError) {
      console.error('Token generation failed for user:', user._id, tokenError);
      // Delete the user since token generation failed
      await User.findByIdAndDelete(user._id);
      throw new Error('Failed to generate token');
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    // Try to get a more specific error message
    const errorMessage = error.message || 'Internal server error';
    const errorType = error.name || 'server_error';
    
    // If we have a user ID, log it for debugging
    if (error.user) {
      console.error('User ID:', error.user._id);
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: errorType
    });
  }
};

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

    // Generate JWT token
    const token = await generateToken(user._id.toString());

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
    const user = await User.findById(req.user._id).select('-password');
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
    const { name, email } = req.body; // Don't accept role from request
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

    // For existing users without role or with 'student' role, set default to 'user'
    if (!user.role || user.role === 'student') {
      user.role = 'user';
    }

    // Only admins can change roles
    const isAdmin = req.user.role === 'admin';
    if (isAdmin) {
      // Admins can change roles of other users
      const { role } = req.body;
      if (role) {
        const validRoles = ['user', 'admin'];
        if (!validRoles.includes(role)) {
          return res.status(400).json({
            message: 'Invalid role',
            error: 'invalid_role'
          });
        }
        user.role = role;
      }
    }

    // Regular users can only update name and email
    if (name) user.name = name;
    if (email) user.email = email;
    
    const updatedUser = await user.save();
    
    res.json({
      success: true,
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
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

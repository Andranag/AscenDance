const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  console.log('Generating token for user ID:', id);
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ascendance-secret-key-2025', { expiresIn: '7d' });
};

const protect = async (req, res, next) => {
  try {
    console.log('Auth middleware called');
    console.log('Headers:', req.headers);
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No authorization header in request');
      return res.status(401).json({ 
        message: 'No authorization header provided',
        error: 'missing_header'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token found in authorization header');
      return res.status(401).json({ 
        message: 'No token provided in authorization header',
        error: 'missing_token'
      });
    }

    try {
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET not configured');
        return res.status(500).json({ 
          message: 'Server configuration error',
          error: 'jwt_secret_not_configured'
        });
      }

      console.log('Verifying token:', token);
      console.log('JWT_SECRET:', process.env.JWT_SECRET);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        console.log('Looking for user with ID:', decoded.id);
        
        // Add more detailed logging
        console.log('Attempting to find user with ID:', decoded.id);
        const user = await User.findById(decoded.id).select('-password');
        console.log('User found:', user ? user._id : 'none');
        console.log('Found user:', user ? user._id : 'none');
        
        if (!user) {
          console.error('User not found:', decoded.userId);
          return res.status(401).json({ 
            message: 'User associated with this token no longer exists',
            error: 'user_not_found'
          });
        }

        req.user = user;
        console.log('Successfully authenticated user:', req.user);
        next();
      } catch (decodeError) {
        console.error('JWT verification error:', decodeError);
        console.error('Error details:', {
          name: decodeError.name,
          message: decodeError.message
        });
        
        if (decodeError.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            message: 'Token has expired. Please login again.',
            error: 'token_expired'
          });
        }
        return res.status(401).json({ 
          message: 'Invalid token format',
          error: 'invalid_token'
        });
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(500).json({ 
        message: 'Internal server error',
        error: 'server_error'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: 'server_error'
    });
  }
};

module.exports = {
  protect,
  generateToken
};

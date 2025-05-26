const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error('No authorization header provided');
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error('No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    // Use hardcoded secret for consistency
    const secret = 'ascendance-secret-key-2025';
    
    try {
      const decoded = jwt.verify(token, secret);
      console.log('Decoded token:', decoded);
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.error('User not found for token');
        return res.status(401).json({ error: 'User not found' });
      }
      
      req.user = user;
      next();
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const generateToken = (user) => {
  const secret = 'ascendance-secret-key-2025';
  const token = jwt.sign({ id: user._id }, secret);
  return token;
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!req.user.isAdmin()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  protect,
  generateToken,
  isAdmin
};

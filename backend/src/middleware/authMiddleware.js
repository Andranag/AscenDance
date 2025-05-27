const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'ascendance-secret-key-2025'; // Fallback to hardcoded secret

// Helper function to verify token and get user
const verifyTokenAndGetUser = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.userId || !decoded.email || !decoded.role) {
      return null;
    }

    const userId = decoded.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }

    const user = await User.findById(userId).select('-password');
    return user;
  } catch (err) {
    return null;
  }
};

// Middleware to protect routes
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const user = await verifyTokenAndGetUser(token);

  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.userId = user._id;
  req.user = user;
  next();
};

// Middleware to check admin role
const isAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }
  next();
};

// Generate token with user data
const generateToken = (user) => {
  if (!user || !user._id || !user.email || !user.role) {
    throw new Error('Invalid user object provided to generateToken');
  }

  return jwt.sign({
    sub: user._id.toString(),
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  }, JWT_SECRET, {
    expiresIn: '30d', // Increased to 30 days
    algorithm: 'HS256'
  });
};

// Export all middleware functions
module.exports = {
  protect,
  generateToken,
  isAdmin
};

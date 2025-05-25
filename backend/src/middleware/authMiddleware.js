const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => 
  jwt.sign({ id: userId }, process.env.JWT_SECRET || 'ascendance-secret-key-2025', { expiresIn: '7d' });

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ascendance-secret-key-2025');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.json({ message: 'Not authorized' });
  }
};

module.exports = {
  protect,
  generateToken
};

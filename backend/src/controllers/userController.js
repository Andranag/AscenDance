const User = require('../models/User');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    return res.json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.json({ message: 'Invalid credentials' });
  }

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({
    id: user._id,
    name: user.name,
    email: user.email
  });
};

const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user._id);
  
  if (name) user.name = name;
  if (email) user.email = email;
  
  await user.save();
  res.json({
    id: user._id,
    name: user.name,
    email: user.email
  });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};

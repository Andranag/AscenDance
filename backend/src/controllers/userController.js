const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const { AppError } = require("../utils/errorHandler");
const { catchAsync } = require("../utils/errorHandler");
const logger = require("../utils/logger");


// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return next(new AppError("User already exists", 400));

  const user = await User.create({
    name, 
    email, 
    password, 
    role
  });

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    message: 'Registration successful'
  });
});

// Login User
const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Invalid credentials", 401));
  }

  // Check if password matches
  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) {
    return next(new AppError("Invalid credentials", 401));
  }


  res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// Logout User
const logoutUser = catchAsync(async (req, res) => {
  res.json({ message: "Logged out successfully" });
});

const getUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

const getAllUsers = catchAsync(async (req, res) => {
  res.json({ message: "All users accessed" });
});


// Initiate password reset
const initiatePasswordReset = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set reset token and expiry
  user.passwordResetToken = resetTokenHash;
  user.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Construct reset URL
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    // Send reset email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click <a href="${resetURL}">here</a> to reset your password. This link will expire in 10 minutes.</p>`
    });

    logger.info(`Password reset link sent to ${user.email}`);

    res.status(200).json({
      message: 'Password reset link sent to email'
    });
  } catch (emailError) {
    logger.error('Failed to send password reset email', { 
      userId: user.id, 
      error: emailError 
    });

    // If email fails, still return success to prevent user enumeration
    res.status(200).json({
      message: 'Password reset link sent to email'
    });
  }
});

// Complete password reset
const completePasswordReset = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;

  // Hash the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with valid reset token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Invalid or expired token', 400));
  }

  // Set new password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
});

// Validate User Token
const validateToken = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return next(error);
  }
});

// Debug method to log hashed password (USE ONLY IN DEVELOPMENT)
const logHashedPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Log the hashed password to the console (IMPORTANT: ONLY USE IN DEVELOPMENT)
  logger.info('Hashed Password Debug', { 
    email: user.email, 
    hashedPassword: user.password 
  });

  res.status(200).json({
    message: 'Hashed password logged to server console',
    email: user.email
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getAllUsers,
  validateToken,
  initiatePasswordReset,
  completePasswordReset,
  logHashedPassword
};

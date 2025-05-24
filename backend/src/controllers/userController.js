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
  try {
    const { email, username, password } = req.body;
    let identifier = email || username;

    if (!identifier || !password) {
      return next(new AppError('Please provide identifier (email/username) and password', 400));
    }

    logger.debug('Attempting login with identifier:', identifier);

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    }).select('+password');

    if (!user) {
      logger.warn('Login attempt failed - User not found', { identifier });
      return next(new AppError("Invalid credentials", 401));
    }

    // Check if password matches
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      logger.warn('Login attempt failed - Invalid password', { identifier });
      return next(new AppError("Invalid credentials", 401));
    }

    try {
      // Generate token using User model method
      const token = await user.generateToken();
      logger.info('Login successful', { 
        userId: user._id,
        identifier,
        role: user.role
      });
      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (tokenError) {
      logger.error('Token generation failed:', {
        error: tokenError.message,
        stack: tokenError.stack,
        userId: user._id,
        identifier
      });
      return next(new AppError('Failed to generate token', 500));
    }
  } catch (error) {
    logger.error('Login error:', {
      error: error.message,
      stack: error.stack,
      identifier: req.body.email || req.body.username
    });
    return next(new AppError('Internal server error', 500));
  }
});

// Logout User
const logoutUser = catchAsync(async (req, res) => {
  res.json({ message: "Logged out successfully" });
});

const getUserProfile = catchAsync(async (req, res, next) => {
  try {
    // If user ID is provided in params, get that user's profile
    if (req.params.id) {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return next(new AppError('User not found', 404));
      }
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      // Get current user's profile
      const user = await User.findById(req.user.id).select('-password');
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
  } catch (error) {
    logger.error('Error getting user profile:', {
      error: error.message,
      userId: req.params.id || req.user.id,
      stack: error.stack
    });
    return next(new AppError('Internal server error', 500));
  }
});

const getAllUsers = catchAsync(async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    throw new AppError('Error fetching users', 500);
  }
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
  try {
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
  } catch (error) {
    logger.error('Password reset failed', {
      error: error.message,
      stack: error.stack
    });
    return next(new AppError('Password reset failed', 400));
  }
});

// Validate User Token
const validateToken = catchAsync(async (req, res, next) => {
  try {
    // Get token from Authorization header or cookie
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new AppError('User not found', 401));
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Token validation failed', {
      error: error.message,
      stack: error.stack
    });
    return next(new AppError('Invalid token', 401));
  }
});

const getUserProfileById = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Error getting user profile by ID:', {
      error: error.message,
      userId: req.params.id,
      stack: error.stack
    });
    return next(new AppError('Internal server error', 500));
  }
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
  getUserProfileById
};

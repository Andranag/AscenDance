const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const { AppError } = require("../utils/errorHandler");
const logger = require("../utils/logger");

// Generate JWT Token
const generateToken = (id) => {
  // Check if SECRET_KEY is set
  if (!process.env.SECRET_KEY) {
    console.error('SECRET_KEY is not set in environment variables');
    throw new Error('SECRET_KEY is not configured');
  }
  
  try {
    const token = jwt.sign({ userId: id }, process.env.SECRET_KEY, { 
      expiresIn: "7d",
      algorithm: 'HS256'
    });
    
    // Log successful token generation
    console.log('Token generated successfully');
    return token;
  } catch (error) {
    console.error('JWT signing failed:', error);
    throw error;
  }
};

// Register User
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      console.log('Missing required fields:', { name, email, password });
      return next(new AppError('Missing required fields', 400));
    }

    console.log('Registration attempt:', { email });

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Registration failed - User already exists:', { email });
      return next(new AppError("User already exists", 400));
    }

    // Create user with proper validation
    console.log('Creating user with data:', { 
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role || 'student'
    });

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: role || 'student'
    });

    console.log('User created successfully:', { userId: user._id });

    // Generate token using User model method
    try {
      console.log('Generating token for user:', { userId: user._id });
      const token = await user.generateToken();
      
      console.log('Token generated successfully:', { userId: user._id });
      
      return res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: 'Registration successful',
        token: token
      });
    } catch (tokenError) {
      console.error('Token generation failed:', {
        error: tokenError.message,
        stack: tokenError.stack,
        userId: user._id,
        email
      });
      
      // Clean up the user if token generation fails
      await User.findByIdAndDelete(user._id);
      
      return next(new AppError('Failed to generate token', 500));
    }

  } catch (error) {
    console.error('Registration error:', {
      error: error.message,
      stack: error.stack,
      email: req.body.email
    });

    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.errors);
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    if (error.code === 11000) {
      console.error('Duplicate key error:', error);
      return res.status(400).json({
        message: 'Duplicate email address',
        errors: {
          email: 'Email address is already registered'
        }
      });
    }

    return next(new AppError('Internal server error', 500));
  }
};

// Login User
const loginUser = async (req, res, next) => {
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
};

// Logout User
const logoutUser = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

const getUserProfile = async (req, res) => {
  try {
    // If user ID is provided in params, get that user's profile
    const userId = req.params.id || req.user._id;
    
    if (!userId) {
      res.status(400).json({
      success: false,
      message: 'No user ID provided'
    });
    }

    const user = await User.findById(userId).select('-password');
    
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
    logger.error('Error getting user profile:', {
      error: error.message,
      stack: error.stack,
      userId: req.params.id || req.user._id
    });
    return next(new AppError('Internal server error', 500));
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// Initiate password reset
const initiatePasswordReset = async (req, res, next) => {
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
};

// Complete password reset
const completePasswordReset = async (req, res, next) => {
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
      return res.status(400).json({
      success: false,
      message: 'Invalid or expired token'
    });
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
    res.status(400).json({
      success: false,
      message: 'Password reset failed'
    });
  }
};

// Validate User Token
const validateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header or cookie
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
      success: false,
      message: 'User not found'
    });
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
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

const getUserProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
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
    logger.error('Error getting user profile:', {
      error: error.message,
      stack: error.stack,
      userId: req.params.id
    });
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    await user.save();

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
    logger.error('Error updating user profile:', {
      error: error.message,
      stack: error.stack,
      userId: req.user._id
    });
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  registerUser,
  login: loginUser,
  logoutUser,
  getUserProfile,
  getAllUsers,
  initiatePasswordReset,
  completePasswordReset,
  validateToken,
  getUserProfileById,
  updateUserProfile
};

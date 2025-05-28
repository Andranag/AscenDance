const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// List of valid email domains
const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

// Email validator function
const isValidEmail = function(email) {
  if (!email || typeof email !== 'string') return false;
  
  // Remove any whitespace
  email = email.trim();
  
  // Basic email format validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;
  
  // Extract domain
  const domain = email.split('@')[1].toLowerCase();
  
  // Check if domain is in our list of valid domains
  if (!validDomains.includes(domain)) return false;
  
  // Additional checks for common invalid patterns
  if (/[a-z]{1}\.[a-z]{1}\.[a-z]{1}\b/i.test(domain)) {
    return false; // Block single letter subdomains
  }
  
  if (/[a-z]{1}\.[a-z]{1}\b/i.test(domain)) {
    return false; // Block single letter domains
  }
  
  if (/[a-z]{1}\.[a-z]{2,3}\b/i.test(domain)) {
    return false; // Block single letter TLDs
  }
  
  return true;
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: isValidEmail,
      message: props => `${props.value} is not a valid email. Please use a valid email from one of these domains: ${validDomains.join(', ')}`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);

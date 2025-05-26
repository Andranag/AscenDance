const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Initialize bcrypt with fallback for Node.js environment
if (typeof bcrypt === 'undefined') {
  console.error('bcrypt is not available. Please install bcryptjs package.');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    set: function(value) {
      // If role is 'student', convert to 'user'
      return value === 'student' ? 'user' : value;
    }
  }
});

// Methods to check admin status
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Static method to get admin users
userSchema.statics.getAdmins = function() {
  return this.find({ role: 'admin' });
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();
    
    // Validate password
    if (!this.password || typeof this.password !== 'string') {
      throw new Error('Password is required and must be a string');
    }
    
    // Hash password
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    
    next();
  } catch (error) {
    console.error('Password hashing error:', error);
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

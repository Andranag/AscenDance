const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  },
  path: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: '90d' // Automatically delete after 90 days
  },
  requestBody: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  status: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  collection: 'user_activities'
});

// Create an index for faster querying
userActivitySchema.index({ user: 1, timestamp: -1 });
userActivitySchema.index({ path: 1, timestamp: -1 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;

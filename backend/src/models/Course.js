const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  instructor: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
    default: 'Beginner'
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  recurringTime: {
    type: String,
    required: true
  },
  maxSpots: {
    type: Number,
    required: true
  },
  sessions: [{
    sessionDate: { type: Date, required: true },
    bookedSpots: { type: Number, default: 0 },
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' }
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  content: [{
    title: String,
    type: String,
    url: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);

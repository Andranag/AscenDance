const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  lessons: [{
    title: String,
    content: String,
    type: {
      type: String,
      enum: ['video', 'article']
    }
  }],
  progress: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedLessons: [{
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
      }
    }]
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
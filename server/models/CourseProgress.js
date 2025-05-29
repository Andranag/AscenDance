import mongoose from 'mongoose';

const courseProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLessons: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  quizScores: [{
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    score: Number,
    attemptedAt: {
      type: Date,
      default: Date.now
    }
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: Date,
    certificateId: String
  }
}, {
  timestamps: true
});

// Calculate progress percentage
courseProgressSchema.methods.getProgressPercentage = function() {
  if (!this.course.lessons || this.course.lessons.length === 0) return 0;
  return (this.completedLessons.length / this.course.lessons.length) * 100;
};

// Check if course is completed
courseProgressSchema.methods.isCompleted = function() {
  return this.completedLessons.length === this.course.lessons.length;
};

export default mongoose.model('CourseProgress', courseProgressSchema);
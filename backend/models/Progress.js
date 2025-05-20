const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedContent: [{
    contentId: {
      type: String,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  notes: [{
    contentId: String,
    note: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Calculate progress percentage
progressSchema.methods.calculateProgress = function() {
  const totalContent = this.course.content.length;
  const completedContent = this.completedContent.length;
  this.progressPercentage = Math.round((completedContent / totalContent) * 100);
};

module.exports = mongoose.model('Progress', progressSchema);

import mongoose from 'mongoose';

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
  style: {
    type: String,
    required: true,
    enum: ['Lindy Hop', 'Rhythm and Blues', 'Authentic Jazz']
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  lessons: [{
    title: String,
    content: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  duration: {
    type: String,
    default: '2 hours'
  },
  studentsCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Course', courseSchema);
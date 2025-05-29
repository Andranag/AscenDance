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
  }]
}, {
  timestamps: true
});

export default mongoose.model('Course', courseSchema);
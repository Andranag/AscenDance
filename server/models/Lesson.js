import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'link'],
      required: true
    },
    url: String
  }],
  quiz: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String
    }],
    passingScore: {
      type: Number,
      default: 70
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('Lesson', lessonSchema);
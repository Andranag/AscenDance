const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  type: {
    type: String,
    enum: ['video', 'article'],
    default: 'video'
  }
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  category: String,
  level: String,
  duration: String,
  lessons: [lessonSchema]
});

module.exports = mongoose.model('Course', courseSchema);

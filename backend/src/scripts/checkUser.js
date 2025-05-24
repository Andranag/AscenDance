require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Course = require('../models/Course');

async function checkUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if user exists
    const userId = '6825bfe5e9bcbae65808056e';
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', {
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Check enrolled courses
    const courses = await Course.find({ enrolledStudents: userId }).populate('enrolledStudents', 'name email');
    console.log('User enrolled in', courses.length, 'courses');
    courses.forEach(course => {
      console.log('- Course:', course.title);
    });

  } catch (error) {
    console.error('Error checking user:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUser();

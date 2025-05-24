require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/userModel');

const courses = [
  {
    title: 'Beginner Ballet',
    image: 'https://example.com/ballet.jpg',
    instructor: 'Sarah Johnson',
    level: 'Beginner',
    description: 'Learn the fundamentals of ballet technique in this welcoming class for beginners.',
    price: 150,
    duration: '60 minutes',
    startDate: new Date('2025-06-01'),
    recurringTime: 'Monday 6:00 PM',
    maxSpots: 20,
    sessions: [
      { sessionDate: new Date('2025-06-01') },
      { sessionDate: new Date('2025-06-08') },
      { sessionDate: new Date('2025-06-15') }
    ]
  },
  {
    title: 'Intermediate Jazz',
    image: 'https://example.com/jazz.jpg',
    instructor: 'Michael Chen',
    level: 'Intermediate',
    description: 'Build on your jazz dance foundation with more complex choreography and technique.',
    price: 180,
    duration: '75 minutes',
    startDate: new Date('2025-06-02'),
    recurringTime: 'Tuesday 7:30 PM',
    maxSpots: 15,
    sessions: [
      { sessionDate: new Date('2025-06-02') },
      { sessionDate: new Date('2025-06-09') },
      { sessionDate: new Date('2025-06-16') }
    ]
  },
  {
    title: 'Advanced Hip Hop',
    image: 'https://example.com/hiphop.jpg',
    instructor: 'Alex Rodriguez',
    level: 'Advanced',
    description: 'Push your hip hop skills to the next level with challenging choreography and technique.',
    price: 200,
    duration: '90 minutes',
    startDate: new Date('2025-06-03'),
    recurringTime: 'Wednesday 8:00 PM',
    maxSpots: 12,
    sessions: [
      { sessionDate: new Date('2025-06-03') },
      { sessionDate: new Date('2025-06-10') },
      { sessionDate: new Date('2025-06-17') }
    ]
  }
];

async function seedCourses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Existing courses cleared');

    // Create new courses
    const createdCourses = await Course.insertMany(courses);
    console.log(`Created ${createdCourses.length} courses`);

    // Add some test users to courses
    const users = await User.find({});
    if (users.length > 0) {
      // Enroll first user in all courses
      for (const course of createdCourses) {
        await Course.findByIdAndUpdate(course._id, {
          $push: { enrolledStudents: users[0]._id }
        }, { new: true });
      }
      console.log('Added test user to courses');
    }

    console.log('Course seeding completed successfully');
  } catch (error) {
    console.error('Error seeding courses:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedCourses();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import User from './models/User.js';

dotenv.config();

const sampleCourses = [
  {
    title: 'Introduction to Swing',
    description: 'Master the fundamentals of swing dancing in this comprehensive course. Learn basic steps, rhythm, and musicality.',
    style: 'Lindy Hop',
    level: 'Beginner',
    lessons: [
      {
        title: 'Basic Steps and Rhythm',
        content: 'Learn the foundational steps and understand swing rhythm.',
        completed: false
      },
      {
        title: 'Partner Connection',
        content: 'Develop lead and follow techniques for better partner dancing.',
        completed: false
      },
      {
        title: 'Basic Turns and Spins',
        content: 'Master the essential turning techniques in swing dancing.',
        completed: false
      }
    ]
  },
  {
    title: 'Rhythm and Blues Foundations',
    description: 'Discover the soulful moves of Rhythm and Blues dancing. Perfect for beginners wanting to explore this expressive dance style.',
    style: 'Rhythm and Blues',
    level: 'Beginner',
    lessons: [
      {
        title: 'Blues Basic Movement',
        content: 'Learn the core body movements and rhythm patterns.',
        completed: false
      },
      {
        title: 'Musical Interpretation',
        content: 'Understanding how to move with blues music.',
        completed: false
      }
    ]
  },
  {
    title: 'Advanced Jazz Steps',
    description: 'Take your jazz dancing to the next level with advanced variations, styling, and improvisation techniques.',
    style: 'Authentic Jazz',
    level: 'Advanced',
    lessons: [
      {
        title: 'Advanced Footwork',
        content: 'Complex jazz step variations and combinations.',
        completed: false
      },
      {
        title: 'Solo Jazz Improvisation',
        content: 'Learn to create your own jazz step variations.',
        completed: false
      }
    ]
  }
];

const sampleUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'admin'
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Course.deleteMany({});
    await User.deleteMany({});

    // Insert sample courses
    await Course.insertMany(sampleCourses);
    console.log('Sample courses inserted');

    // Insert sample user
    await User.create(sampleUser);
    console.log('Sample user inserted');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
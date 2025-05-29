import mongoose from 'mongoose';
import Course from '../models/Course.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Mapping of categories to styles
const categoryToStyle = {
  'aaa': 'Lindy Hop',
  'bbb': 'Rhythm and Blues',
  'ccc': 'Authentic Jazz'
};

// Mapping of levels (make sure to update with your actual levels)
const levelMapping = {
  'beginner': 'Beginner',
  'intermediate': 'Intermediate',
  'advanced': 'Advanced'
};

async function updateCourses() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI environment variable is not set. Please check your .env file.');
      console.error('Current environment variables:', process.env);
      return;
    }
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Get all courses
    const courses = await Course.find();
    console.log(`Found ${courses.length} courses to update`);

    // Update each course
    for (const course of courses) {
      // Map category to style
      const style = categoryToStyle[course.category] || 'Lindy Hop';
      
      // Map level to proper case
      const level = levelMapping[course.level] || 'Beginner';
      
      // Create default lessons array
      const lessons = [{
        title: `Introduction to ${course.title}`,
        content: `Welcome to ${course.title}! This is the first lesson of the course.`,
        completed: false
      }];

      // Update course with explicit fields
      await Course.findByIdAndUpdate(course._id, {
        title: course.title,
        description: course.description,
        style: 'Lindy Hop', // Default style
        level: 'Beginner', // Default level
        lessons: [{
          title: `Introduction to ${course.title}`,
          content: `Welcome to ${course.title}! This is the first lesson of the course.`,
          completed: false
        }]
      }, { new: true });

      console.log(`Updated course: ${course.title}`);
    }

    console.log('All courses have been updated!');
  } catch (error) {
    console.error('Error updating courses:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the update function
updateCourses();

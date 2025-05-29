import mongoose from 'mongoose';
import Course from '../models/Course.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

async function checkCourse() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI environment variable is not set');
      return;
    }
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);

    // Find one course to check
    const course = await Course.findOne().lean();
    if (!course) {
      console.log('No courses found in database');
      return;
    }

    console.log('\n=== Course Details ===');
    console.log('Title:', course.title);
    console.log('Description:', course.description);
    console.log('Style:', course.style);
    console.log('Level:', course.level);
    console.log('Lessons:', course.lessons);
    console.log('Image:', course.image);
    console.log('Duration:', course.duration);
    console.log('Category:', course.category); // Should be undefined
  } catch (error) {
    console.error('Error checking course:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkCourse();

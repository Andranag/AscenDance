// node server/scripts/addCategoryAndDuration.js

import mongoose from 'mongoose';
import Course from '../models/Course.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Mapping for style to category
const styleToCategory = {
  'Lindy Hop': 'aaa',
  'Rhythm and Blues': 'bbb',
  'Authentic Jazz': 'ccc'
};

async function addCategoryAndDuration() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI environment variable is not set');
      return;
    }
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);

    const courses = await Course.find();
    console.log(`Found ${courses.length} courses to update`);

    for (const course of courses) {
      // Map style to category
      const category = styleToCategory[course.style] || 'aaa';
      
      // Set default duration
      const duration = course.duration || '1 hour';

      await Course.findByIdAndUpdate(course._id, {
        category,
        duration
      }, { new: true });

      console.log(`Updated course: ${course.title} with category: ${category} and duration: ${duration}`);
    }

    console.log('All courses have been updated with category and duration!');
  } catch (error) {
    console.error('Error updating courses:', error);
  } finally {
    mongoose.connection.close();
  }
}

addCategoryAndDuration();

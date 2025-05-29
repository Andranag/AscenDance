import mongoose from 'mongoose';
import Course from '../models/Course.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

async function updateCourseAnalytics() {
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
      // Set default values if they don't exist
      const updates = {
        duration: course.duration || '2 hours',
        studentsCount: course.studentsCount || 0,
        rating: course.rating || 0,
        reviewsCount: course.reviewsCount || 0
      };

      await Course.findByIdAndUpdate(course._id, updates, { new: true });
      console.log(`Updated analytics for course: ${course.title}`);
    }

    console.log('All courses have been updated with analytics data!');
  } catch (error) {
    console.error('Error updating course analytics:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateCourseAnalytics();

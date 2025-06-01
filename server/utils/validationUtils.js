import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['user', 'admin']).default('user')
});

// Course validation schemas
export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  style: z.enum([
    'Lindy Hop',
    'Balboa',
    'Solo Jazz',
    'Blues',
    'Boogie Woogie',
    'Shag',
    'Rhythm and Blues'
  ]),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'All Levels']),
  price: z.number().min(0),
  duration: z.string()
});

// Lesson validation schemas
export const lessonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  videoUrl: z.string().url('Invalid URL'),
  duration: z.number().min(1),
  order: z.number().min(1)
});

// Enrollment validation schemas
export const enrollmentSchema = z.object({
  courseId: z.string().min(24, 'Invalid course ID'),
  userId: z.string().min(24, 'Invalid user ID')
});

// Export validators
export const validateUser = (data) => userSchema.parse(data);
export const validateCourse = (data) => courseSchema.parse(data);
export const validateLesson = (data) => lessonSchema.parse(data);
export const validateEnrollment = (data) => enrollmentSchema.parse(data);

import { z } from 'zod';
import { COURSE_LEVELS, COURSE_STYLES } from './constants.js';

// Base schemas
const baseUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['user', 'admin']).default('user')
});

const baseCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  level: z.enum(COURSE_LEVELS, {
    errorMap: () => ({ message: 'Invalid course level' })
  }),
  style: z.enum(COURSE_STYLES, {
    errorMap: () => ({ message: 'Invalid course style' })
  }),
  price: z.number().min(0, 'Price must be non-negative'),
  duration: z.string().optional(),
  thumbnail: z.string().url('Invalid thumbnail URL').optional(),
  instructor: z.string().optional(),
  prerequisites: z.array(z.string()).optional()
});

const baseLessonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  videoUrl: z.string().url('Invalid URL'),
  duration: z.number().min(1),
  order: z.number().min(1)
});

const baseEnrollmentSchema = z.object({
  courseId: z.string().min(24, 'Invalid course ID'),
  userId: z.string().min(24, 'Invalid user ID')
});

// Full schemas
export const userSchema = baseUserSchema;
export const courseSchema = baseCourseSchema;
export const lessonSchema = baseLessonSchema;
export const enrollmentSchema = baseEnrollmentSchema;

// Partial schemas for updates
export const partialUserSchema = baseUserSchema.partial();
export const partialCourseSchema = baseCourseSchema.partial();
export const partialLessonSchema = baseLessonSchema.partial();
export const partialEnrollmentSchema = baseEnrollmentSchema.partial();

// Custom validators
export const validateUser = (data) => userSchema.parse(data);
export const validateCourse = (data) => courseSchema.parse(data);
export const validateLesson = (data) => lessonSchema.parse(data);
export const validateEnrollment = (data) => enrollmentSchema.parse(data);

// Partial validators for updates
export const validatePartialUser = (data) => partialUserSchema.parse(data);
export const validatePartialCourse = (data) => partialCourseSchema.parse(data);
export const validatePartialLesson = (data) => partialLessonSchema.parse(data);
export const validatePartialEnrollment = (data) => partialEnrollmentSchema.parse(data);

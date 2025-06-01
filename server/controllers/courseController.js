import { Course } from '../models/index.js';
import { BaseController } from '../utils/baseController.js';
import { validateCourse } from '../utils/schemas.js';

export class CourseController extends BaseController {
  constructor() {
    super(Course);
  }

  getFeaturedCourses = async (req, res) => {
    try {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', '0');

      const allCourses = await this.Model.find({});
      this.logger.info('Courses fetched for featured courses', { totalCourses: allCourses.length });
      
      let selectedCourses = allCourses;
      while (selectedCourses.length < 4) {
        selectedCourses = [...selectedCourses, ...selectedCourses];
      }
      
      const shuffled = selectedCourses.sort(() => Math.random() - 0.5);
      const finalCourses = shuffled.slice(0, 4);
      
      const formattedCourses = finalCourses.map(course => ({
        _id: course._id.toString(),
        title: course.title,
        description: course.description,
        style: course.style,
        level: course.level,
        instructor: course.instructor,
        price: course.price,
        duration: course.duration,
        rating: course.rating,
        enrolled: course.enrolled,
        image: course.image
      }));

      this.logger.info('Featured courses generated successfully', { 
        totalFeatured: formattedCourses.length,
        firstCourseId: formattedCourses[0]?._id
      });

      return this.successResponse(res, formattedCourses, 'Featured courses retrieved successfully');
    } catch (error) {
      this.logger.error('Error fetching featured courses', error);
      return this.errorResponse(res, error);
    }
  };

  getById = async (req, res) => {
    try {
      const course = await super.getById(req, res);
      try {
        validateCourse(course);
        return this.successResponse(res, course);
      } catch (error) {
        throw new ValidationError('Invalid course data', error.errors);
      }
    } catch (error) {
      this.logger.error('Error getting course', error);
      return this.errorResponse(res, error);
    }
  };

  getAll = async (req, res) => {
    try {
      const courses = await this.Model.find();
      return this.successResponse(res, courses);
    } catch (error) {
      this.logger.error('Error fetching courses', error);
      return this.errorResponse(res, error);
    }
  };

  create = async (req, res) => {
    try {
      const data = this.validators.create(req.body);
      const course = new this.Model(data);
      await course.save();
      this.logger.info('Course created successfully', { courseId: course._id });
      return this.successResponse(res, course, 'Course created successfully', 201);
    } catch (error) {
      this.logger.error('Error creating course', error);
      return this.errorResponse(res, error);
    }
  };

  update = async (req, res) => {
    try {
      const id = req.params.id;
      const updates = this.validators.update(req.body);
      const course = await this.Model.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
      if (!course) {
        throw new NotFoundError('Course not found');
      }
      this.logger.info('Course updated successfully', { courseId: id });
      return this.successResponse(res, course, 'Course updated successfully');
    } catch (error) {
      this.logger.error('Error updating course', error);
      return this.errorResponse(res, error);
    }
  };

  delete = async (req, res) => {
    try {
      const id = req.params.id;
      const course = await this.Model.findByIdAndDelete(id);
      if (!course) {
        throw new NotFoundError('Course not found');
      }
      this.logger.info('Course deleted successfully', { courseId: id });
      return this.successResponse(res, null, 'Course deleted successfully');
    } catch (error) {
      this.logger.error('Error deleting course', error);
      return this.errorResponse(res, error);
    }
  };
}

// Export instance of controller
export const courseController = new CourseController();
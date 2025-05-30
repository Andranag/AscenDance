import axios from 'axios';
import { API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/api';

const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: '/api'
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const headers = getAuthHeaders();
    config.headers = { ...config.headers, ...headers };
    return config;
  },
  (error) => Promise.reject(new Error(handleApiError(error)))
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(handleApiError(error)))
);

export const courseService = {
  getAllCourses: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.courses.list);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to fetch courses');
      }
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  getFeaturedCourses: async () => {
    try {
      console.log('Fetching featured courses...');
      const response = await api.get(API_ENDPOINTS.courses.featured);
      console.log('Featured courses response:', response.data);
      
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to fetch featured courses');
      }

      // Validate and normalize course data
      const courses = response.data.data;
      if (!Array.isArray(courses)) {
        throw new Error('Invalid courses data received');
      }

      // Ensure each course has required fields
      const validCourses = courses.map(course => ({
        _id: course._id,
        title: course.title || 'Untitled Course',
        description: course.description || 'No description available',
        style: course.style || 'General',
        level: course.level || 'All Levels',
        image: course.image || "https://images.pexels.com/photos/2188012/pexels-photo-2188012.jpeg",
        duration: course.duration || '2 hours',
        studentsCount: course.studentsCount || 0,
        rating: course.rating || 0,
        lessons: Array.isArray(course.lessons) ? course.lessons : []
      }));

      return {
        success: true,
        data: validCourses
      };
    } catch (error) {
      console.error('Error in getFeaturedCourses:', error);
      throw new Error(handleApiError(error));
    }
  },
  getCourse: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.courses.detail(id));
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to fetch course');
      }
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
  createCourse: async (data) => {
    try {
      console.log('Creating course with data:', data);
      const response = await api.post(API_ENDPOINTS.courses.create, data);
      console.log('Create course response:', response.data);
      // If response doesn't have success property, assume it's the course data
      if (!response.data?.success) {
        return response.data;
      }
      return response.data.data;
    } catch (error) {
      console.error('Create course error:', error.response?.data || error);
      throw new Error(handleApiError(error));
    }
  },
  updateCourse: async (id, data) => {
    try {
      console.log('Updating course with id:', id, 'and data:', data);
      const response = await api.put(API_ENDPOINTS.courses.update(id), data);
      console.log('Update course response:', response.data);
      // If response doesn't have success property, assume it's the course data
      if (!response.data?.success) {
        return response.data;
      }
      return response.data.data;
    } catch (error) {
      console.error('Update course error:', error.response?.data || error);
      throw new Error(handleApiError(error));
    }
  },
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(API_ENDPOINTS.courses.delete(id));
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to delete course');
      }
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};

export const userService = {
  createUser: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.users.list, data);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to create user');
      }
      const userData = response.data.data;
      if (!userData || !userData.id) {
        throw new Error('Invalid user data received from server');
      }
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      };
    } catch (error) {
      console.error('Create user error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create user');
    }
  },
  toggleRole: async (id) => {
    try {
      const response = await api.patch(API_ENDPOINTS.users.toggleRole(id));
      return response.data.data;
    } catch (error) {
      console.error('Toggle role error:', error);
      throw new Error(handleApiError(error));
    }
  },
  getAllUsers: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.users.list);
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw new Error(handleApiError(error));
    }
  },
  getUser: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.users.detail(id));
      if (!response.data?.success) {
        throw new Error(response.data.message || 'Failed to fetch user');
      }
      return response.data.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user');
    }
  },
  updateUser: async (id, data) => {
    try {
      if (!id) {
        throw new Error('Invalid user ID');
      }
      const response = await api.put(API_ENDPOINTS.users.update(id), data);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to update user');
      }
      const userData = response.data.data;
      return {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        courseProgress: userData.courseProgress
      };
    } catch (error) {
      console.error('Update user error:', error);
      throw new Error(handleApiError(error));
    }
  },
  deleteUser: async (id) => {
    try {
      if (!id) {
        throw new Error('Invalid user ID');
      }
      const response = await api.delete(API_ENDPOINTS.users.delete(id));
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to delete user');
      }
      return response.data.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete user');
    }
  }
};

export const analyticsService = {
  getOverview: () => api.get(API_ENDPOINTS.analytics.overview),
  getCourseStats: () => api.get(API_ENDPOINTS.analytics.courseStats),
  getUserStats: () => api.get(API_ENDPOINTS.analytics.userStats),
};
import { api, API_ENDPOINTS } from '../utils/api';

export const analyticsService = {
  async getCourseRatings(timeRange = 'month') {
    return api.get(API_ENDPOINTS.analytics.courseRatings(timeRange));
  },

  async getEnrollmentTrends(timeRange = 'month') {
    return api.get(API_ENDPOINTS.analytics.enrollmentTrends(timeRange));
  },

  async getPopularCourses(timeRange = 'month') {
    return api.get(API_ENDPOINTS.analytics.popularCourses(timeRange));
  },

  async getStudentProgress(studentId) {
    return api.get(API_ENDPOINTS.analytics.studentProgress(studentId));
  },

  async getCoursePerformance(courseId) {
    return api.get(API_ENDPOINTS.analytics.coursePerformance(courseId));
  },

  async getCompletionRates() {
    return api.get(API_ENDPOINTS.analytics.completionRates());
  },

  async getRevenueTrends(timeRange = 'month') {
    return api.get(API_ENDPOINTS.analytics.revenueTrends(timeRange));
  },

  async getStudentRetention() {
    return api.get(API_ENDPOINTS.analytics.studentRetention());
  }
};

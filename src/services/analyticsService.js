import BaseService from './BaseService';

export class AnalyticsService extends BaseService {
  async getCourseRatings(timeRange = 'month') {
    return this.request({
      method: 'GET',
      url: `/api/analytics/course-ratings?range=${timeRange}`
    });
  }

  async getEnrollmentTrends(timeRange = 'month') {
    return this.request({
      method: 'GET',
      url: `/api/analytics/enrollment-trends?range=${timeRange}`
    });
  }

  async getPopularCourses(timeRange = 'month') {
    return this.request({
      method: 'GET',
      url: `/api/analytics/popular-courses?range=${timeRange}`
    });
  }

  async getStudentProgress(studentId) {
    return this.request({
      method: 'GET',
      url: `/api/analytics/student-progress/${studentId}`
    });
  }

  async getCoursePerformance(courseId) {
    return this.request({
      method: 'GET',
      url: `/api/analytics/course-performance/${courseId}`
    });
  }

  async getCompletionRates() {
    return this.request({
      method: 'GET',
      url: '/api/analytics/completion-rates'
    });
  }

  async getRevenueTrends(timeRange = 'month') {
    return this.request({
      method: 'GET',
      url: `/api/analytics/revenue-trends?range=${timeRange}`
    });
  }

  async getStudentRetention() {
    return this.request({
      method: 'GET',
      url: '/api/analytics/student-retention'
    });
  }
}

export const analyticsService = new AnalyticsService();

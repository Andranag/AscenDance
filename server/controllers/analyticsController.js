import { successResponse, errorResponse } from '../utils/errorUtils.js';
import { logger } from '../utils/logger.js';
import { 
  getUserMetrics,
  getCompletionRate,
  getCourseStats,
  getUserProgress
} from '../utils/analyticsUtils.js';

export class AnalyticsController {
  static async getOverview(req, res) {
    try {
      const [metrics, rate] = await Promise.all([
        getUserMetrics(),
        getCompletionRate()
      ]);

      const data = {
        ...metrics,
        completionRate: rate
      };

      logger.info('Analytics overview fetched successfully');
      return successResponse(res, data);
    } catch (error) {
      logger.error('Error getting analytics overview', error);
      return errorResponse(res, error);
    }
  }

  static async getCourseStats(req, res) {
    try {
      const stats = await getCourseStats();
      logger.info('Course stats fetched successfully');
      return successResponse(res, stats);
    } catch (error) {
      logger.error('Error getting course stats', error);
      return errorResponse(res, error);
    }
  }

  static async getUserStats(req, res) {
    try {
      const userId = req.params.userId;
      const stats = await getUserProgress(userId);
      
      if (!stats) {
        throw new Error('User not found');
      }

      logger.info('User stats fetched successfully', { userId });
      return successResponse(res, stats);
    } catch (error) {
      logger.error('Error getting user stats', error);
      return errorResponse(res, error);
    }
  }
}

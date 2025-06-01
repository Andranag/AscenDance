import User from '../models/User.js';
import Course from '../models/Course.js';
import { successResponse, errorResponse } from '../utils/errorUtils.js';

const getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const activeUsers = await User.countDocuments({ 'courseProgress': { $exists: true, $ne: [] } });
    const completionRate = await User.aggregate([
      {
        $unwind: '$courseProgress'
      },
      {
        $group: {
          _id: null,
          totalCompleted: {
            $sum: {
              $cond: [
                { $eq: ['$courseProgress.completed', true] },
                1,
                0
              ]
            }
          },
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          rate: {
            $multiply: [
              { $divide: ['$totalCompleted', '$total'] },
              100
            ]
          }
        }
      }
    ]);

    logger.info('Overview retrieved successfully', {
      totalUsers,
      totalCourses,
      activeUsers,
      completionRate: completionRate[0]?.rate || 0
    });
    return successResponse(res, {
      totalUsers,
      totalCourses,
      activeUsers,
      completionRate: completionRate[0]?.rate || 0
    });
  } catch (error) {
    logger.error('Error fetching overview', error);
    return errorResponse(res, error);
  }
};

const getCourseStats = async (req, res) => {
  try {
    const courseStats = await Course.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'courseProgress.course',
          as: 'enrollments'
        }
      },
      {
        $project: {
          title: 1,
          style: 1,
          level: 1,
          enrollmentCount: { $size: '$enrollments' },
          completionRate: {
            $multiply: [
              {
                $divide: [
                  {
                    $size: {
                      $filter: {
                        input: '$enrollments',
                        as: 'enrollment',
                        cond: { $eq: ['$$enrollment.completed', true] }
                      }
                    }
                  },
                  { $max: [{ $size: '$enrollments' }, 1] }
                ]
              },
              100
            ]
          }
        }
      }
    ]);

    return successResponse(res, courseStats);
  } catch (error) {
    return errorResponse(res, error);
  }
};

const getUserStats = async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    return successResponse(res, userStats);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export {
  getOverview,
  getCourseStats,
  getUserStats
};
import User from '../models/User.js';
import Course from '../models/Course.js';

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

    res.json({
      totalUsers,
      totalCourses,
      activeUsers,
      completionRate: completionRate[0]?.rate || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    res.json(courseStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    res.json(userStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getOverview,
  getCourseStats,
  getUserStats
};
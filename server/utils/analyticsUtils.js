import { User, Course } from '../models/index.js';

export const getAggregatedMetrics = async (pipeline) => {
  try {
    const result = await User.aggregate(pipeline);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    throw new Error(`Error aggregating metrics: ${error.message}`);
  }
};

export const getUserMetrics = async () => {
  const [totalUsers, totalCourses, activeUsers] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    User.countDocuments({ 'courseProgress': { $exists: true, $ne: [] } })
  ]);

  return {
    totalUsers,
    totalCourses,
    activeUsers
  };
};

export const getCompletionRate = async () => {
  const pipeline = [
    { $unwind: '$courseProgress' },
    { $group: {
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
    }},
    { $project: {
      rate: {
        $multiply: [
          { $divide: ['$totalCompleted', '$total'] },
          100
        ]
      }
    }}
  ];

  const result = await getAggregatedMetrics(pipeline);
  return result ? result.rate : 0;
};

export const getCourseStats = async () => {
  const pipeline = [
    { $group: {
      _id: '$style',
      count: { $sum: 1 }
    }},
    { $sort: { count: -1 } }
  ];

  return await getAggregatedMetrics(pipeline);
};

export const getUserProgress = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  return {
    totalCourses: user.courseProgress.length,
    completedCourses: user.courseProgress.filter(cp => cp.completed).length,
    progress: user.courseProgress.map(cp => ({
      courseId: cp.courseId,
      completed: cp.completed,
      progress: cp.progress
    }))
  };
};

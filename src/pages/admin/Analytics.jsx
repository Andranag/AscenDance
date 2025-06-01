import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Users, TrendingUp, Star, BookOpen, GraduationCap } from 'lucide-react';
import { analyticsService } from "../../services/analyticsService";
import { showToast } from "../../utils/toast";
import { responseUtils } from "../../utils/response";
import { apiErrorUtils } from "../../utils/apiError";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');

  const [courseRatingsData, setCourseRatingsData] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch course ratings
        const ratingsResponse = await analyticsService.getCourseRatings(timeRange);
        if (responseUtils.isSuccess(ratingsResponse)) {
          setCourseRatingsData({
            labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
            datasets: [{
              label: 'Number of Ratings',
              data: ratingsResponse.data,
              backgroundColor: [
                'rgba(var(--color-primary), 0.8)',
                'rgba(var(--color-secondary), 0.8)',
                'rgba(var(--color-accent), 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(156, 163, 175, 0.8)',
              ],
            }],
          });
        }

        // Fetch enrollment data
        const enrollmentResponse = await analyticsService.getEnrollmentTrends(timeRange);
        if (responseUtils.isSuccess(enrollmentResponse)) {
          setEnrollmentData({
            labels: enrollmentResponse.data.labels,
            datasets: [
              {
                label: 'New Enrollments',
                data: enrollmentResponse.data.newEnrollments,
                borderColor: 'rgb(var(--color-primary))',
                backgroundColor: 'rgba(var(--color-primary), 0.1)',
                tension: 0.4,
              },
              {
                label: 'Active Students',
                data: enrollmentResponse.data.activeStudents,
                borderColor: 'rgb(var(--color-accent))',
                backgroundColor: 'rgba(var(--color-accent), 0.1)',
                tension: 0.4,
              }
            ],
          });
        }
      } catch (error) {
        const errorResponse = apiErrorUtils.handleApiError(error);
        showToast.fromResponse(errorResponse);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Dance Academy Insights</h1>
            <p className="text-white/80 mt-1">Track student progress and course performance</p>
          </div>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input-field w-auto bg-white/90"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">1,234</p>
                <span className="text-sm text-emerald-600">+12.5%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <span className="text-sm text-emerald-600">+0.2</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Courses</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">24</p>
                <span className="text-sm text-emerald-600">+3</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <span className="text-sm text-emerald-600">+5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Enrollment Trends */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Enrollment Trends</h2>
              <p className="text-sm text-gray-600">Student enrollment over time</p>
            </div>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <Line 
            data={enrollmentData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Students'
                  }
                },
              },
            }} 
          />
        </div>

        {/* Course Ratings Distribution */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Rating Distribution</h2>
              <p className="text-sm text-gray-600">Course ratings breakdown</p>
            </div>
            <Star className="w-5 h-5 text-secondary" />
          </div>
          <div className="aspect-square max-w-[300px] mx-auto">
            <Doughnut 
              data={courseRatingsData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Most Popular Courses */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Popular Courses</h2>
              <p className="text-sm text-gray-600">Courses with highest enrollment</p>
            </div>
            <BookOpen className="w-5 h-5 text-accent" />
          </div>
          <Bar 
            data={popularCoursesData}
            options={{
              indexAxis: 'y',
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Students'
                  }
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
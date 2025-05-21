import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User, Award, ChevronRight } from 'lucide-react';
import { Button } from '../components/common/Button';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch('http://localhost:3050/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    // Navigate to course view
    navigate(`/student/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-black/90 border-r border-white/10">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Student Dashboard</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/student/dashboard" 
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/student/courses" 
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Courses</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/student/profile" 
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        <div className="bg-black/90 rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Welcome Back, Student!</h1>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12 text-red-400">
                {error}
              </div>
            ) : (
              courses.map((course) => (
                <div 
                  key={course.id} 
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{course.name}</h3>
                    <Award className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-white/80 mb-4">{course.description}</p>
                  <div className="flex justify-end">
                    <Button variant="secondary">
                      View Course
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

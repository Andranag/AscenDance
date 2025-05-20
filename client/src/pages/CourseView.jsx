import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, BookOpen, Clock, User, Award, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const CourseView = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourse();
    checkEnrollment();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`http://localhost:3050/api/courses/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
      }
    } catch (error) {
      toast.error('Failed to fetch course details');
    } finally {
      setIsLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await fetch(`http://localhost:3050/api/courses/${id}/enrollment`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setIsEnrolled(data.enrolled);
      }
    } catch (error) {
      toast.error('Failed to check enrollment status');
    }
  };

  const handleEnroll = async () => {
    try {
      const response = await fetch(`http://localhost:3050/api/courses/${id}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        toast.success('Successfully enrolled in course');
        setIsEnrolled(true);
      }
    } catch (error) {
      toast.error('Failed to enroll in course');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!course) {
    return <div className="flex items-center justify-center min-h-screen">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Play className="w-6 h-6 text-purple-400" />
            <h3 className="font-medium">{course.title}</h3>
          </div>
          <nav className="space-y-2">
            <Link to={`/student/course/${id}/content`} className="flex items-center px-4 py-3 text-white bg-white/10 rounded-lg">
              <BookOpen className="w-5 h-5 mr-3" />
              Course Content
            </Link>
            <Link to={`/student/course/${id}/schedule`} className="flex items-center px-4 py-3 text-white/70 hover:bg-white/5 rounded-lg transition-colors">
              <Clock className="w-5 h-5 mr-3" />
              Schedule
            </Link>
            <Link to={`/student/course/${id}/students`} className="flex items-center px-4 py-3 text-white/70 hover:bg-white/5 rounded-lg transition-colors">
              <User className="w-5 h-5 mr-3" />
              Students
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-medium">{course.title}</h1>
            <p className="text-white/70">{course.description}</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Course Info */}
            <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6">
              <h2 className="text-xl font-medium mb-4">Course Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white/70">Duration</p>
                    <p className="font-medium">{course.duration} mins</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <User className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white/70">Instructor</p>
                    <p className="font-medium">{course.instructor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Envelope className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white/70">Level</p>
                    <p className="font-medium">{course.level}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6">
              <h2 className="text-xl font-medium mb-4">Course Content</h2>
              <div className="space-y-4">
                {course.content.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-white/70">{item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enroll Button */}
          {!isEnrolled && (
            <div className="mt-8">
              <Button 
                onClick={handleEnroll} 
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                Enroll Now - ${course.price}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseView;

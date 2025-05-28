import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Music2, CheckCircle, Clock, ChevronRight, Loader } from 'lucide-react';

const CoursePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Simulated API call
        const mockCourse = {
          _id: courseId,
          title: 'Introduction to Swing',
          description: 'Master the fundamentals of swing dancing in this comprehensive course. Learn basic steps, rhythm, and musicality.',
          style: 'Swing',
          level: 'Beginner',
          lessons: [
            {
              _id: 'l1',
              title: 'Basic Steps and Rhythm',
              content: 'Learn the foundational steps and understand swing rhythm.',
              completed: false
            },
            {
              _id: 'l2',
              title: 'Partner Connection',
              content: 'Develop lead and follow techniques for better partner dancing.',
              completed: false
            },
            {
              _id: 'l3',
              title: 'Basic Turns and Spins',
              content: 'Master the essential turning techniques in swing dancing.',
              completed: false
            }
          ]
        };
        setCourse(mockCourse);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.message || 'Failed to fetch course data');
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleComplete = async (lessonId) => {
    try {
      setLoading(prev => ({ ...prev, [lessonId]: true }));
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCourse(prev => ({
        ...prev,
        lessons: prev.lessons.map(lesson =>
          lesson._id === lessonId ? { ...lesson, completed: !lesson.completed } : lesson
        )
      }));
    } catch (error) {
      console.error('Error updating lesson status:', error);
    } finally {
      setLoading(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-custom p-4">
      <div className="max-w-4xl mx-auto">
        {error ? (
          <div className="card backdrop-blur-sm bg-white/95 text-center p-8">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : course ? (
          <div className="space-y-6">
            <div className="card backdrop-blur-sm bg-white/95">
              <div className="flex items-start gap-4">
                <Music2 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h1 className="heading-primary mb-2">{course.title}</h1>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium">
                      {course.style}
                    </div>
                    <div className="bg-secondary/10 text-secondary rounded-full px-4 py-1 text-sm font-medium">
                      {course.level}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card backdrop-blur-sm bg-white/95">
              <h2 className="heading-secondary mb-6">Course Content</h2>
              <div className="space-y-4">
                {course.lessons.map((lesson) => (
                  <div
                    key={lesson._id}
                    className="bg-gray-50/50 rounded-lg p-6 transition-all duration-200 hover:bg-gray-50/80"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {lesson.title}
                        </h3>
                        <p className="text-gray-600">{lesson.content}</p>
                      </div>
                      <button
                        onClick={() => handleComplete(lesson._id)}
                        disabled={loading[lesson._id]}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                          lesson.completed
                            ? 'bg-accent/10 text-accent hover:bg-accent/20'
                            : 'btn-primary'
                        }`}
                      >
                        {loading[lesson._id] ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : lesson.completed ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Completed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5" />
                            <span>Mark Complete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card backdrop-blur-sm bg-white/95">
              <h2 className="heading-secondary mb-4">Ready to Practice?</h2>
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <span>Start Dancing</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8">
            <Loader className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
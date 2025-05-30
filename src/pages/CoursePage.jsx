import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/api';
import { Music2, CheckCircle, Clock, ChevronRight, Loader, Play, Video, FileText, Award } from 'lucide-react';
import LessonCard from '../components/course/LessonCard';
import ProgressBar from '../components/course/ProgressBar';
import QuizCard from '../components/course/QuizCard';
import ResourceList from '../components/course/ResourceList';

const CoursePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    console.log('CoursePage: courseId:', courseId);
    const fetchCourse = async () => {
      try {
        setLoading(true);
        console.log('Fetching course:', courseId);
        const response = await courseService.getCourse(courseId);
        console.log('API Response:', JSON.stringify(response, null, 2));
        try {
          // The courseService already returns the data object
          const courseData = response;
          console.log('Course data:', JSON.stringify(courseData, null, 2));
          if (courseData && typeof courseData === 'object') {
            setCourse(courseData);
            // Calculate initial progress if lessons exist
            if (Array.isArray(courseData.lessons)) {
              const completedLessons = courseData.lessons.filter(l => l?.completed).length;
              setProgress((completedLessons / courseData.lessons.length) * 100);
            }
            setError(null); // Clear any previous error
          } else {
            console.error('Invalid course data:', courseData);
            setError('Invalid course data received');
          }
        } catch (err) {
          console.error('Error processing course data:', err);
          setError('Failed to process course data');
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        console.error('Response:', response);
        setError('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleLessonSelect = (lesson) => {
    setActiveLesson(lesson);
    setShowQuiz(false);
  };

  const handleQuizSubmit = async (answers) => {
    try {
      // Calculate score
      const questions = activeLesson.quiz.questions;
      const correctAnswers = answers.map((answer, index) => answer === questions[index].correctAnswer);
      const score = (correctAnswers.filter(Boolean).length / questions.length) * 100;
      const passed = score >= 70;

      // Update lesson completion status
      const updatedLesson = { ...activeLesson, completed: passed };
      const updatedCourse = { ...course };
      const lessonIndex = updatedCourse.lessons.findIndex(l => l._id === activeLesson._id);
      if (lessonIndex !== -1) {
        updatedCourse.lessons[lessonIndex] = updatedLesson;
        
        // Update course in database
        await courseService.updateCourse(courseId, updatedCourse);
        
        // Update local state
        setCourse(updatedCourse);
        
        // Update progress
        const completedLessons = updatedCourse.lessons.filter(l => l.completed).length;
        setProgress((completedLessons / updatedCourse.lessons.length) * 100);
      }

      return {
        type: passed ? 'success' : 'error',
        message: passed 
          ? `Congratulations! You scored ${score}%` 
          : `You scored ${score}%. Try again to pass.`
      };
    } catch (error) {
      console.error('Error submitting quiz:', error);
      return {
        type: 'error',
        message: 'Failed to submit quiz. Please try again.'
      };
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log('Fetching course with ID:', courseId);
        const response = await courseService.getCourse(courseId);
        console.log('API Response:', response);
        
        if (!response?.success) {
          throw new Error(response?.message || 'Failed to fetch course');
        }
        
        const course = response.data;
        console.log('Fetched course:', course);
        
        setCourse(course);
        setActiveLesson(course.lessons[0]);
        
        // Calculate initial progress
        const completedLessons = course.lessons.filter(l => l.completed).length;
        setProgress((completedLessons / course.lessons.length) * 100);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.message || 'Failed to fetch course data');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-custom p-4 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-custom p-4">
        <div className="max-w-4xl mx-auto">
          <div className="card backdrop-blur-sm bg-white/95 text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-red-500">{error}</p>
            <button 
              className="btn btn-primary mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-custom">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p className="text-lg">{error}</p>
            <button 
              className="btn-primary mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : course ? (
          <div className="space-y-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {course.title}
              </h1>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {course.style}
                </span>
                <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  {course.level}
                </span>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{course.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-600">{course.rating} ★</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{course.studentsCount} students</span>
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Course Progress</h2>
                {course && Array.isArray(course.lessons) ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-primary">
                      {Math.round(progress)}% Complete
                    </span>
                    <span className="text-sm text-gray-500">
                      ({course.lessons.filter(l => l.completed).length} of {course.lessons.length} lessons)
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Loading course progress...
                  </div>
                )}
              </div>
              {course && Array.isArray(course.lessons) ? (
                <ProgressBar progress={progress} />
              ) : (
                <div className="h-4 bg-gray-100 rounded-full">
                  <div className="h-4 bg-primary rounded-full" style={{ width: '0%' }} />
                </div>
              )}
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Lessons</h2>
              <div className="space-y-4">
                {course && Array.isArray(course.lessons) ? (
                  course.lessons.map((lesson) => (
                    <LessonCard
                      key={lesson._id}
                      lesson={lesson}
                      onSelect={handleLessonSelect}
                      isActive={activeLesson?._id === lesson._id}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                    <p className="text-gray-600 text-lg">Loading lessons...</p>
                  </div>
                )}
              </div>
            </div>

            {activeLesson && (
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6">
                {showQuiz ? (
                  <QuizCard
                    quiz={activeLesson.quiz}
                    onSubmit={handleQuizSubmit}
                    onBack={() => setShowQuiz(false)}
                  />
                ) : activeLesson.resources?.length ? (
                  <ResourceList
                    resources={activeLesson.resources}
                    onBack={() => setActiveLesson(null)}
                  />
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeLesson.title}
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                      {activeLesson.content}
                    </div>
                    {activeLesson.quiz && (
                      <button
                        onClick={() => setShowQuiz(true)}
                        className="btn-primary w-full"
                      >
                        Start Quiz
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Course not found
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
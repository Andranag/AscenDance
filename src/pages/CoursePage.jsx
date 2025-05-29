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

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-custom">
      <div className="max-w-4xl mx-auto p-4">
        <div className="card backdrop-blur-sm bg-white/95">
          <div className="flex flex-col md:flex-row gap-6 p-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>
              <div className="flex gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <Music2 className="w-4 h-4" />
                  <span>{course.style}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{course.level}</span>
                </div>
              </div>
              <div className="flex gap-4 mb-8">
                <ProgressBar progress={progress} />
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">{Math.round(progress)}% Complete</span>
                </div>
              </div>
              <div className="space-y-4">
                {course.lessons.map((lesson) => (
                  <LessonCard
                    key={lesson._id}
                    lesson={lesson}
                    isActive={activeLesson?._id === lesson._id}
                    onSelect={handleLessonSelect}
                  />
                ))}
              </div>
            </div>
            <div className="w-full md:w-96">
              {activeLesson && (
                <>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-4">{activeLesson.title}</h2>
                    <p className="text-gray-600 mb-6">{activeLesson.description}</p>
                    {activeLesson.videoUrl && (
                      <div className="aspect-video mb-6">
                        <video src={activeLesson.videoUrl} controls className="w-full" />
                      </div>
                    )}
                    {activeLesson.content && (
                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">Lesson Content</h3>
                        <p>{activeLesson.content}</p>
                      </div>
                    )}
                    {activeLesson.resources && activeLesson.resources.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">Resources</h3>
                        <ResourceList resources={activeLesson.resources} />
                      </div>
                    )}
                    {activeLesson.quiz && (
                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">Quiz</h3>
                        {showQuiz ? (
                          <QuizCard
                            questions={activeLesson.quiz.questions}
                            onSubmit={handleQuizSubmit}
                          />
                        ) : (
                          <button
                            className="btn btn-primary w-full"
                            onClick={() => setShowQuiz(true)}
                          >
                            Start Quiz
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
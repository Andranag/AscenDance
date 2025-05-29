import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
    const fetchCourse = async () => {
      try {
        // This would be replaced with an actual API call
        const mockCourse = {
          _id: courseId,
          title: 'Introduction to Swing',
          description: 'Master the fundamentals of swing dancing in this comprehensive course.',
          style: 'Swing',
          level: 'Beginner',
          lessons: [
            {
              _id: 'l1',
              title: 'Basic Steps and Rhythm',
              description: 'Learn the foundational steps and understand swing rhythm.',
              videoUrl: 'https://example.com/video1.mp4',
              content: 'Detailed explanation of basic swing steps...',
              duration: 15,
              completed: true,
              resources: [
                {
                  title: 'Basic Steps Guide',
                  type: 'pdf',
                  url: '/resources/basic-steps-guide.pdf'
                },
                {
                  title: 'Rhythm Practice Video',
                  type: 'video',
                  url: '/resources/rhythm-practice.mp4'
                }
              ],
              quiz: {
                questions: [
                  {
                    question: 'What is the basic rhythm count in swing?',
                    options: ['1-2-3-4', '5-6-7-8', 'Rock-Step-Triple-Step', '1-2-3-4-5-6'],
                    correctAnswer: 2
                  },
                  {
                    question: 'Which foot do you start with in the basic step?',
                    options: ['Left foot', 'Right foot', 'Either foot', 'Back foot'],
                    correctAnswer: 0
                  }
                ]
              }
            },
            {
              _id: 'l2',
              title: 'Partner Connection',
              description: 'Develop lead and follow techniques for better partner dancing.',
              videoUrl: 'https://example.com/video2.mp4',
              content: 'Understanding partner connection in swing...',
              duration: 20,
              completed: false,
              resources: [
                {
                  title: 'Connection Tips',
                  type: 'pdf',
                  url: '/resources/connection-tips.pdf'
                }
              ]
            },
            {
              _id: 'l3',
              title: 'Basic Turns and Spins',
              description: 'Master the essential turning techniques in swing dancing.',
              videoUrl: 'https://example.com/video3.mp4',
              content: 'Learning basic turns and spins...',
              duration: 25,
              completed: false
            }
          ]
        };
        setCourse(mockCourse);
        setActiveLesson(mockCourse.lessons[0]);
        
        // Calculate initial progress
        const completedLessons = mockCourse.lessons.filter(l => l.completed).length;
        setProgress((completedLessons / mockCourse.lessons.length) * 100);
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

  const handleLessonSelect = (lesson) => {
    setActiveLesson(lesson);
    setShowQuiz(false);
  };

  const handleQuizSubmit = async (answers) => {
    // This would be replaced with an actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock quiz validation
    const score = 85;
    const passed = score >= 70;

    return {
      type: passed ? 'success' : 'error',
      message: passed 
        ? `Congratulations! You scored ${score}%` 
        : `You scored ${score}%. Try again to pass.`
    };
  };

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
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-custom p-4">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Course Header */}
          <div className="card backdrop-blur-sm bg-white/95">
            <div className="flex items-start gap-4">
              <Music2 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h1 className="heading-primary mb-2">{course.title}</h1>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium">
                    {course.style}
                  </div>
                  <div className="bg-secondary/10 text-secondary rounded-full px-4 py-1 text-sm font-medium">
                    {course.level}
                  </div>
                </div>
                <ProgressBar progress={progress} showCertificate={true} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Section */}
            <div className="lg:col-span-2 space-y-6">
              {activeLesson && !showQuiz ? (
                <div className="card backdrop-blur-sm bg-white/95">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg mb-4">
                    <div className="flex items-center justify-center">
                      <Play className="w-16 h-16 text-white opacity-50" />
                    </div>
                  </div>
                  <h2 className="heading-secondary">{activeLesson.title}</h2>
                  <p className="text-gray-600 mt-2">{activeLesson.description}</p>
                  <div className="mt-4 prose max-w-none">
                    {activeLesson.content}
                  </div>
                  
                  {activeLesson.resources && (
                    <div className="mt-8">
                      <ResourceList resources={activeLesson.resources} />
                    </div>
                  )}

                  {activeLesson.quiz && (
                    <button 
                      onClick={() => setShowQuiz(true)}
                      className="btn-primary mt-8"
                    >
                      Take Quiz
                    </button>
                  )}
                </div>
              ) : showQuiz && activeLesson.quiz ? (
                <div className="card backdrop-blur-sm bg-white/95">
                  <h2 className="heading-secondary mb-6">Lesson Quiz</h2>
                  <QuizCard 
                    quiz={activeLesson.quiz}
                    onSubmit={handleQuizSubmit}
                  />
                </div>
              ) : (
                <div className="card backdrop-blur-sm bg-white/95 text-center p-8">
                  <Video className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h2 className="heading-secondary">Select a Lesson</h2>
                  <p className="text-gray-600">Choose a lesson from the list to start learning</p>
                </div>
              )}
            </div>

            {/* Lesson List */}
            <div className="space-y-4">
              <div className="card backdrop-blur-sm bg-white/95">
                <h2 className="heading-secondary mb-6">Course Content</h2>
                <div className="space-y-4">
                  {course.lessons.map((lesson, index) => (
                    <LessonCard
                      key={lesson._id}
                      lesson={lesson}
                      isCompleted={lesson.completed}
                      isLocked={!lesson.completed && index > 0 && !course.lessons[index - 1].completed}
                      isActive={activeLesson?._id === lesson._id}
                      onSelect={handleLessonSelect}
                    />
                  ))}
                </div>
              </div>

              {/* Achievement Card */}
              <div className="card backdrop-blur-sm bg-white/95">
                <div className="flex items-center gap-4">
                  <Award className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Course Achievement</h3>
                    <p className="text-sm text-gray-600">Complete all lessons to earn your certificate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
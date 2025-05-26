import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Header, Segment, List, Icon } from 'semantic-ui-react';
import { fetchWithAuth } from '../api';

const CoursePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Check if a lesson is completed for the current user
  const isLessonCompleted = (lessonId) => {
    try {
      // Debug logging
      console.log('Checking if lesson is completed:', {
        lessonId,
        courseProgress: course?.progress,
        currentCourse: course
      });

      if (!course?.progress) {
        console.log('No course progress found');
        return false;
      }

      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser?.id) {
        console.log('No user data found');
        return false;
      }

      // Find the user's progress in the array
      const userProgress = course.progress.find(p => {
        if (!p?.userId) return false;
        return p.userId.toString() === storedUser.id.toString();
      });
      if (!userProgress) {
        console.log('No progress found for user:', storedUser.id);
        return false;
      }

      // Debug logging
      console.log('User progress:', userProgress);
      console.log('Completed lessons:', userProgress.completedLessons);

      // Check if the lesson is completed
      const isCompleted = userProgress.completedLessons.some(cl => {
        if (!cl?.lessonId) return false;
        return cl.lessonId.toString() === lessonId.toString();
      });
      console.log('Lesson completion status:', isCompleted);
      return isCompleted;
    } catch (error) {
      console.error('Error checking lesson completion:', error);
      return false;
    }
  };

  // Check if user is authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  const { courseId } = useParams();
  console.log('Route params:', useParams());
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState({});

  // Initialize loading state for all lessons when course loads
  useEffect(() => {
    if (course?.lessons) {
      const initialLoading = {};
      course.lessons.forEach((_, index) => {
        initialLoading[index] = false;
      });
      setLoading(initialLoading);
    }
  }, [course]);

  // Update loading state for a specific lesson
  const updateLoadingState = (index, isLoading) => {
    setLoading(prev => ({
      ...prev,
      [index]: isLoading
    }));
  };

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetchWithAuth(`/api/courses/${courseId}`);
        console.log('Raw course response:', response);
        const data = response?.data || response;
        console.log('Processed course data:', data);
        
        // Initialize progress if not present
        if (!data.progress) {
          data.progress = [];
        }
        
        setCourse(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course. Please try again.');
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleComplete = async (lessonIndex) => {
    try {
      updateLoadingState(lessonIndex, true);
      
      // Ensure we have a valid course and get the lesson
      if (!course || !course._id) {
        throw new Error('Course data not available');
      }
      const lesson = course.lessons[lessonIndex];
      if (!lesson) {
        throw new Error('Lesson not found');
      }

      console.log('Marking lesson as complete:', {
        courseId,
        lessonIndex,
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        endpoint: `/api/courses/${courseId}/lessons/${lessonIndex}/complete`
      });

      const response = await fetchWithAuth(`/api/courses/${courseId}/lessons/${lessonIndex}/complete`, {
        method: 'PUT'
      });

      if (response) {
        console.log('Received response:', response);
        // The backend returns the entire course object directly
        setCourse(response);
        setError(null);
      } else {
        throw new Error('No response received from server');
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
      setError(error.message || 'Failed to mark lesson as complete. Please try again.');
    } finally {
      updateLoadingState(lessonIndex, false);
    }
  };

  const handleUnmark = async (lessonIndex) => {
    try {
      updateLoadingState(lessonIndex, true);
      
      // Ensure we have a valid course and get the lesson
      if (!course || !course._id) {
        throw new Error('Course data not available');
      }
      const lesson = course.lessons[lessonIndex];
      if (!lesson) {
        throw new Error('Lesson not found');
      }

      console.log('Unmarking lesson:', {
        courseId,
        lessonIndex,
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        endpoint: `/api/courses/${courseId}/lessons/${lessonIndex}/complete`
      });

      const response = await fetchWithAuth(`/api/courses/${courseId}/lessons/${lessonIndex}/complete`, {
        method: 'DELETE'
      });

      if (response) {
        console.log('Received response:', response);
        // The backend returns the entire course object directly
        setCourse(response);
        setError(null);
      } else {
        throw new Error('No response received from server');
      }
    } catch (error) {
      console.error('Error unmarking lesson:', error);
      setError(error.message || 'Failed to unmark lesson. Please try again.');
    } finally {
      updateLoadingState(lessonIndex, false);
    }
  };

  return (
    <Container>
      {error ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      ) : course ? (
        <>
          <Header as='h1'>{course.title}</Header>
          <Segment>
            <p>{course.description}</p>
          </Segment>
          <Header as='h2'>Lessons</Header>
          <List>
            {course.lessons.map((lesson, index) => (
              <List.Item key={lesson._id}>
                <List.Content>
                  <List.Header>
                    {lesson.title}
                    {isLessonCompleted(lesson._id) && <Icon name='check circle' color='green' size='small' style={{ marginLeft: '8px' }} />}
                  </List.Header>
                  <List.Description>{lesson.content}</List.Description>
                  <button 
                    className={`ui ${isLessonCompleted(lesson._id) ? 'green' : 'primary'} button`} 
                    onClick={() => {
                      // Prevent double-clicks by checking loading state
                      if (loading[index]) return;
                      
                      // Update loading state before calling handler
                      updateLoadingState(index, true);
                      
                      // Call appropriate handler
                      if (isLessonCompleted(lesson._id)) {
                        handleUnmark(index);
                      } else {
                        handleComplete(index);
                      }
                    }}
                    disabled={loading[index]}
                    style={{ width: '100%' }}
                  >
                    {loading[index] ? (
                      <>
                        <Icon name='spinner' loading /> Loading...
                      </>
                    ) : isLessonCompleted(lesson._id) ? (
                      <>
                        <Icon name='checkmark' /> Unmark as Complete
                      </>
                    ) : (
                      <>
                        <Icon name='check circle outline' /> Mark as Complete
                      </>
                    )}
                  </button>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </>
      ) : null}
    </Container>
  );
};

export default CoursePage;
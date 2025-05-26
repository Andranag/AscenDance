import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Header, Segment, List, Icon } from 'semantic-ui-react';
import { fetchWithAuth } from '../api';

const CoursePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Check if a lesson is completed for the current user
  const isLessonCompleted = (lessonId) => {
    if (!course?.progress) return false;
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) return false;
    const userProgress = course.progress.find(p => p.userId.toString() === storedUser._id);
    if (!userProgress) return false;
    return userProgress.completedLessons.some(cl => cl.lessonId.toString() === lessonId.toString());
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
  const [loading, setLoading] = useState({});

  useEffect(() => {
    console.log('Fetching course with ID:', courseId);
    console.log('Current course data:', course);
    const fetchCourse = async () => {
      try {
        const data = await fetchWithAuth(`/api/courses/${courseId}`);
        console.log('Fetched course data:', data);
        if (!data) {
          throw new Error('Failed to fetch course data');
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
      setLoading(true);
      
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
        endpoint: `/courses/${courseId}/lessons/${lessonIndex}/complete`
      });

      const response = await fetchWithAuth(`/api/courses/${courseId}/lessons/${lessonIndex}/complete`, {
        method: 'PUT'
      });

      if (!response) {
        throw new Error('No response from server');
      }

      // Update the local state with the new course data
      if (response && response.data) {
        setCourse(response.data);
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from server');
      }
      setError(null);

      // Show success message
      setTimeout(() => {
        setError(null);
      }, 3000);
    } catch (err) {
      console.error('Error marking lesson as complete:', err);
      setError('Failed to mark lesson as complete. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnmark = async (lessonIndex) => {
    try {
      setLoading(true);
      
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

      if (!response) {
        throw new Error('No response from server');
      }

      // Update the local state with the new course data
      if (response) {
        // Handle both direct course object and nested response
        const newCourseData = response.data || response;
        setCourse(newCourseData);
      } else {
        console.error('No response received');
        throw new Error('No response from server');
      }
      setError(null);

      // Show success message
      setTimeout(() => {
        setError(null);
      }, 3000);
    } catch (err) {
      console.error('Error unmarking lesson:', err);
      setError('Failed to unmark lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header as='h1'>{course?.title}</Header>
      <Segment>
        <p>{course?.description}</p>
      </Segment>
      
      <Header as='h2'>Lessons</Header>
      <List>
        {course?.lessons?.map((lesson, index) => (
          <List.Item key={lesson._id}>
            <List.Content>
              <List.Header>
                {lesson.title}
                {isLessonCompleted(lesson._id) && <Icon name='check circle' color='green' size='small' style={{ marginLeft: '8px' }} />}
              </List.Header>
              <List.Description>{lesson.content}</List.Description>
              <button 
                className={`ui ${isLessonCompleted(lesson._id) ? 'green' : 'primary'} button`} 
                onClick={() => isLessonCompleted(lesson._id) ? handleUnmark(index) : handleComplete(index)}
                disabled={loading[index]}
                style={{ width: '100%' }}
              >
                {loading[index] ? (
                    <>
                      <Icon name='spinner' loading /> Loading...
                    </>
                ) : isLessonCompleted(lesson._id) ? (
                  <>
                    <Icon name='checkmark' /> Completed
                    <Icon name='undo' style={{ marginLeft: '8px' }} />
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
    </Container>
  );
};

export default CoursePage;
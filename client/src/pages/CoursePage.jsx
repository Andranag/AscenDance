import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Header, Segment, List, Icon } from 'semantic-ui-react';
import { fetchWithAuth } from '../api';

const CoursePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  // Check if a lesson is completed for the current user
  const isLessonCompleted = (lessonId) => {
    if (!course?.progress) return false;
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) return false;
    const userProgress = course.progress.find(p => p.userId.toString() === storedUser._id);
    if (!userProgress) return false;
    return userProgress.completedLessons.some(cl => cl.lessonId.toString() === lessonId.toString());
  };

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
    if (loading) return; // Prevent multiple submissions
    
    try {
      setLoading(true);
      
      // Validate inputs
      if (!course || !course._id) {
        throw new Error('Course data not available');
      }
      if (typeof lessonIndex !== 'number' || lessonIndex < 0 || lessonIndex >= course.lessons.length) {
        throw new Error('Invalid lesson index');
      }
      const lesson = course.lessons[lessonIndex];
      if (!lesson || !lesson._id) {
        throw new Error('Lesson not found');
      }

      console.log('Marking lesson as complete:', {
        courseId: course._id,
        lessonIndex,
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        endpoint: `/api/courses/${course._id}/lessons/${lessonIndex}/complete`
      });

      // Make API request with proper headers
      const response = await fetchWithAuth(`/api/courses/${course._id}/lessons/${lessonIndex}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response) {
        throw new Error('No response from server');
      }

      // Update state and localStorage
      setCourse(response);
      if (localStorage.getItem('token')) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          localStorage.setItem('user', JSON.stringify({
            ...storedUser,
            progress: response.progress
          }));
        }
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
  }

  const handleUnmark = async (lessonIndex) => {
    if (loading) return; // Prevent multiple submissions
    
    try {
      setLoading(true);
      
      // Validate inputs
      if (!course || !course._id) {
        throw new Error('Course data not available');
      }
      if (typeof lessonIndex !== 'number' || lessonIndex < 0 || lessonIndex >= course.lessons.length) {
        throw new Error('Invalid lesson index');
      }
      const lesson = course.lessons[lessonIndex];
      if (!lesson || !lesson._id) {
        throw new Error('Lesson not found');
      }

      console.log('Unmarking lesson:', {
        courseId: course._id,
        lessonIndex,
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        endpoint: `/api/courses/${course._id}/lessons/${lessonIndex}/complete`
      });

      // Make API request with proper headers
      const response = await fetchWithAuth(`/api/courses/${course._id}/lessons/${lessonIndex}/complete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response) {
        throw new Error('No response from server');
      }

      // Update state and localStorage
      setCourse(response);
      if (localStorage.getItem('token')) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          localStorage.setItem('user', JSON.stringify({
            ...storedUser,
            progress: response.progress
          }));
        }
      }

      setError(null);
      
      // Show success message
      setTimeout(() => {
        setError(null);
      }, 3000);
    } catch (err) {
      console.error('Error unmarking lesson:', err);
      setError('Failed to unmark lesson. Please try again.');
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Container>
        <Header as='h1'>Error</Header>
        <p>{error}</p>
        <button className="ui primary button" onClick={() => navigate('/courses')}>Back to Courses</button>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container>
        <Header as='h1'>Loading Course...</Header>
      </Container>
    );
  }

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
                disabled={loading}
                style={{ width: '100%' }}
              >
                {isLessonCompleted(lesson._id) ? (
                  <>
                    <Icon name='checkmark' /> Completed
                    <Icon name='undo' style={{ marginLeft: '8px' }} />
                  </>
                ) : loading ? (
                  <>
                    <Icon name='spinner' loading /> Marking...
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
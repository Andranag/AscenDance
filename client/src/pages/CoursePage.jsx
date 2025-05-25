import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Header, Segment, List } from 'semantic-ui-react';
import { fetchWithAuth } from '../api';

const CoursePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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
  const [loading, setLoading] = useState(false);

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
        endpoint: `/api/courses/${courseId}/lessons/${lessonIndex}/complete`
      });

      // Log the full request details
      console.log('Request details:', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? 'Bearer [token]' : 'No token'
        },
        body: null
      });

      const response = await fetchWithAuth(`/api/courses/${courseId}/lessons/${lessonIndex}/complete`, {
        method: 'PUT'
      });

      console.log('API Response:', response);
      console.log('Course data before update:', course);
      console.log('Response data:', response);

      if (!response) {
        throw new Error('No response from server');
      }

      // Update the course state with the new data
      setCourse(prevCourse => ({
        ...prevCourse,
        ...response
      }));
      setError(null);
    } catch (err) {
      console.error('Error marking lesson as complete:', err);
      setError('Failed to mark lesson as complete. Please try again.');
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
              <List.Header>{lesson.title}</List.Header>
              <List.Description>{lesson.content}</List.Description>
              <button 
                className="ui primary button" 
                onClick={() => handleComplete(index)}
                disabled={lesson.completed || loading}
                style={{ width: '100%' }}
              >
                {lesson.completed ? 'Completed' : loading ? 'Marking...' : 'Mark as Complete'}
              </button>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Container>
  );
};

export default CoursePage;
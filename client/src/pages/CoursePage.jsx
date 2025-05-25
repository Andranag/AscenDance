import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Header, Segment, List, Button } from 'semantic-ui-react';
import { fetchWithAuth } from '../api';

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await fetchWithAuth(`/api/courses/${courseId}`);
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

  const handleComplete = async (lessonId) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to mark lesson as complete: ${response.status}`);
      }
      const data = await response.json();
      setCourse(data);
    } catch (err) {
      console.error('Error marking lesson as complete:', err);
      setError('Failed to mark lesson as complete. Please try again.');
    }
  };

  if (error) {
    return (
      <Container>
        <Header as='h1'>Error</Header>
        <p>{error}</p>
        <Button primary onClick={() => navigate('/courses')}>Back to Courses</Button>
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
      <Header as='h1'>{course.title}</Header>
      <Segment>
        <p>{course.description}</p>
      </Segment>
      
      <Header as='h2'>Lessons</Header>
      <List>
        {course.lessons.map((lesson) => (
          <List.Item key={lesson._id}>
            <List.Content>
              <List.Header>{lesson.title}</List.Header>
              <List.Description>{lesson.content}</List.Description>
              <Button 
                primary 
                onClick={() => handleComplete(lesson._id)}
                disabled={lesson.completed}
              >
                {lesson.completed ? 'Completed' : 'Mark as Complete'}
              </Button>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Container>
  );
};

export default CoursePage;
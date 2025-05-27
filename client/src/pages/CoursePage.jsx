import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Header, Segment, List, Icon, Button } from 'semantic-ui-react';
import { useAuth } from '../contexts/AuthContext';

const CoursePage = () => {
  const navigate = useNavigate();
  const { user, fetchWithAuth } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (!user) {
    navigate('/login');
    return null;
  }

  // Check if a lesson is completed for the current user
  const isLessonCompleted = (lessonId) => {
    try {
      if (!course?.progress) {
        return false;
      }

      const userProgress = course.progress.find(p => p.userId === user.id);
      if (!userProgress) {
        return false;
      }

      return userProgress.completedLessons.some(cl => cl.lessonId === lessonId);
    } catch (error) {
      console.error('Error checking lesson completion:', error);
      return false;
    }
  };

  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({});

  const updateLoadingState = useCallback((index, isLoading) => {
    setLoading(prev => ({
      ...prev,
      [index]: isLoading
    }));
  }, []);

  // Fetch course data
  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetchWithAuth(`/api/courses/${courseId}`);
        console.log('Raw course response:', response);
        const data = response?.data || response;
        console.log('Processed course data:', data);
        
        // Initialize progress if not present
        if (!data?.progress) {
          data.progress = [];
        }
        
        setCourse(data);
        setError(null);
        
        // Fetch user progress if user is logged in
        if (user?.id) {
          try {
            const progressResponse = await fetchWithAuth(`/api/courses/${courseId}/progress/${user.id}`);
            console.log('Progress response:', progressResponse);
            if (progressResponse?.data?.progress) {
              setCourse(prev => ({
                ...prev,
                progress: progressResponse.data.progress
              }));
            }
          } catch (progressErr) {
            console.error('Error fetching progress:', progressErr);
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.message || 'Failed to fetch course data');
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, user?.id]);

  const handleComplete = async (lessonIndex) => {
    try {
      console.log('Starting completion for lesson:', lessonIndex);
      
      // Update loading state
      updateLoadingState(lessonIndex, true);
      
      const response = await fetchWithAuth(`/api/courses/${courseId}/lessons/${lessonIndex}/complete`, {
        method: 'PUT'
      });
      
      console.log('Response:', response);
      console.log('Response data:', response?.data);
      
      if (response && response.data && response.data.progress) {
        console.log('Progress data:', response.data.progress);
        setCourse(prev => ({
          ...prev,
          progress: response.data.progress
        }));
      }
    } catch (error) {
      console.error('Error in handleComplete:', error);
    } finally {
      updateLoadingState(lessonIndex, false);
    }
  };

  const handleUnmark = async (lessonIndex) => {
    const response = await fetchWithAuth(`/api/courses/${courseId}/lessons/${lessonIndex}/complete`, {
      method: 'DELETE'
    });
    if (response && response.data) {
      setCourse(prev => ({
        ...prev,
        progress: response.data.progress
      }));
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
                  <Button 
                    className={isLessonCompleted(lesson._id) ? 'green' : 'primary'} 
                    onClick={() => {
                      handleComplete(index);
                    }}
                    disabled={loading[index]}
                    fluid
                    size='large'
                    style={{ marginTop: '1rem' }}
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
                  </Button>
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
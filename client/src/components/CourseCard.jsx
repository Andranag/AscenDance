import { Card } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

const CourseCard = ({ course }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!user && !!token;

  // Add useEffect to re-render when auth state changes
  useEffect(() => {
    console.log('Auth state changed:', isAuthenticated);
  }, [user, token]);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthStateChanged = () => {
      console.log('Auth state changed event received');
    };
    window.addEventListener('authStateChanged', handleAuthStateChanged);
    return () => window.removeEventListener('authStateChanged', handleAuthStateChanged);
  }, []);

  const handleNavigate = () => {
    if (isAuthenticated) {
      navigate(`/course/${course._id}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <Card 
      fluid 
      style={{ 
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Card.Content 
        style={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Card.Header 
          style={{ 
            fontSize: '1.5rem',
            marginBottom: '1rem'
          }}
        >
          {course.title}
        </Card.Header>
        <Card.Description 
          style={{ 
            flexGrow: 1,
            lineHeight: '1.5',
            overflow: 'hidden'
          }}
        >
          {course.description}
        </Card.Description>
      </Card.Content>
      <Card.Content 
        extra 
        style={{ 
          textAlign: 'center',
          marginTop: '1rem'
        }}
      >
        <button
          onClick={handleNavigate}
          className='ui primary button'
          style={{
            minWidth: '120px',
            padding: '0.75rem 1rem'
          }}
        >
          {isAuthenticated ? 'Start Course' : 'Sign In'}
        </button>
      </Card.Content>
    </Card>
  );
}

export default CourseCard;

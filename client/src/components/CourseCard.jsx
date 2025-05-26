import { Card } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CourseCard = ({ course }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!user;

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
          className={`ui ${isAuthenticated ? 'primary' : 'basic'} button`}
          style={{
            minWidth: '120px',
            padding: '0.75rem 1rem'
          }}
        >
          {isAuthenticated ? 'Start Course' : 'Sign In to Start'}
        </button>
      </Card.Content>
    </Card>
  );
}

export default CourseCard;

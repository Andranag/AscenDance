import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'semantic-ui-react';
import ProfileEditor from '../components/ProfileEditor';

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container>
      <h1>Profile</h1>
      <ProfileEditor
        user={{ name: '', email: '' }}
        onUpdate={async (updates) => {
          const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updates)
          });
          const data = await response.json();
          return data;
        }}
      />
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default Profile;

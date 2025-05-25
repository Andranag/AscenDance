import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'semantic-ui-react';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password')
      })
    });

    const data = await response.json();
    localStorage.setItem('token', data.token);
    navigate('/courses');
  };

  return (
    <Container style={{ marginTop: '4em' }}>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          fluid
          icon='mail'
          iconPosition='left'
          name='email'
          placeholder='Email'
        />
        <Form.Input
          fluid
          icon='lock'
          iconPosition='left'
          name='password'
          type='password'
          placeholder='Password'
        />
        <Button type='submit' fluid primary>Login</Button>
      </Form>
    </Container>
  );
};

export default Login;

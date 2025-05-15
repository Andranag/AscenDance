import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome Home</h1>
      {user && <p>Hello, {user.name}!</p>}
      <p>This is the home page of your application.</p>
    </div>
  );
};

export default Home;
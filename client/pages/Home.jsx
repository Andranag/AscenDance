import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const HomeCard = ({ title, description, icon, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className='bg-white rounded-2xl shadow-lg p-6 space-y-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer'
    >
      <div className='flex items-center space-x-4'>
        <div className='bg-blue-100 p-3 rounded-full'>
          <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={icon} />
          </svg>
        </div>
        <h2 className='text-xl font-bold text-gray-800'>{title}</h2>
      </div>
      <p className='text-gray-600'>{description}</p>
    </div>
  );
};

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const homeCards = [
    {
      title: 'Book a Class',
      description: 'Explore and reserve your favorite dance classes.',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      onClick: () => navigate('/classes')
    },
    {
      title: 'My Profile',
      description: 'View and manage your profile details.',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a8 8 0 00-8 8h16a8 8 0 00-8-8z',
      onClick: () => navigate('/profile')
    }
  ];

  return (
    <Layout>
      <div className='container mx-auto px-4 py-8 space-y-8'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg'>
          <h1 className='text-3xl font-bold mb-4'>
            Welcome, {user ? user.name : 'Dancer'}
          </h1>
          <p className='text-white opacity-80'>
            Ready to elevate your dance journey? Let's get moving!
          </p>
        </div>

        {/* Quick Actions */}
        <div className='grid md:grid-cols-2 gap-6'>
          {homeCards.map((card, index) => (
            <HomeCard 
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              onClick={card.onClick}
            />
          ))}
        </div>

        {/* Upcoming Classes */}
        <div className='bg-white rounded-2xl shadow-lg p-6'>
          <h2 className='text-2xl font-bold mb-4 text-gray-800'>Upcoming Classes</h2>
          <p className='text-gray-600'>No upcoming classes. Start exploring!</p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
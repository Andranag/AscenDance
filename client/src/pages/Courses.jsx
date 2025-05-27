import React, { useState, useEffect } from 'react';
import { Container as UIContainer, Grid as UIGrid } from 'semantic-ui-react';
import CourseCard from '../components/CourseCard';
import { Link } from 'react-router-dom';
import { fetchPublic } from '../api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetchPublic('/api/courses');
        
        if (!response || typeof response !== 'object') {
          throw new Error('Invalid response format');
        }

        // Handle both array and nested object responses
        let courses = Array.isArray(response) ? response : response.data || [];
        
        if (!Array.isArray(courses)) {
          throw new Error('Invalid courses data format');
        }

        // Filter out courses with missing required fields
        const validCourses = courses.filter(course => 
          course && course.title && course.description
        );

        if (validCourses.length === 0) {
          throw new Error('No courses found');
        }

        setCourses(validCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message || 'Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <UIContainer>
        <h2>Loading courses...</h2>
      </UIContainer>
    );
  }

  if (error) {
    return (
      <UIContainer>
        <h2>Error: {error}</h2>
        <Link to='/login' className='ui primary button'>
          Go to Login
        </Link>
      </UIContainer>
    );
  }

  if (courses.length === 0) {
    console.log('Courses data:', courses);
    return (
      <UIContainer>
        <h2>No courses available</h2>
      </UIContainer>
    );
  }

  return (
    <UIContainer style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Available Courses</h1>
      <UIGrid 
        columns={3}
        doubling
        stackable
        style={{ 
          justifyContent: 'center',
          alignItems: 'stretch',
          marginBottom: '2rem'
        }}
      >
        {courses.map(course => (
          <UIGrid.Column 
            key={course._id}
            style={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'stretch',
              padding: '1rem'
            }}
          >
            <CourseCard course={course} />
          </UIGrid.Column>
        ))}
      </UIGrid>
    </UIContainer>
  );
};

export default Courses;

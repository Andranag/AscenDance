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
        console.log('Fetching courses from:', '/api/courses');
        const response = await fetchPublic('/api/courses');
        console.log('Raw response:', response);
        
        // Handle both array and nested object responses
        let courses = Array.isArray(response) ? response : response.data || [];
        
        // If we got a single object instead of array, wrap it in an array
        if (!Array.isArray(courses)) {
          courses = [courses];
        }
        console.log('Processed courses:', courses);
        
        if (!Array.isArray(courses)) {
          console.error('Invalid response format:', {
            type: typeof courses,
            value: courses
          });
          setError('Failed to load courses. Please try again.');
          setLoading(false);
          return;
        }
        
        // Filter out courses with missing required fields
        const validCourses = courses.filter(course => 
          course && course.title && course.description
        );
        console.log('Valid courses:', validCourses);
        
        if (validCourses.length === 0) {
          console.error('No valid courses found:', courses);
          setError('No valid courses found');
          setLoading(false);
          return;
        }
        
        setCourses(validCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again.');
        setLoading(false);
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

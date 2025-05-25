import React, { useState, useEffect } from 'react';
import { Container as UIContainer, Grid as UIGrid } from 'semantic-ui-react';
import CourseCard from '../components/CourseCard';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('Fetching courses from:', '/api/courses');
        const response = await fetchWithAuth('/api/courses');
        console.log('Raw response:', response);
        
        if (response.error) {
          console.error('Error response:', {
            error: response.error,
            message: response.message
          });
          setError(response.message || 'Failed to load courses');
          return;
        }
        
        // Handle both array and object responses
        const courses = Array.isArray(response) ? response : response.data || [];
        console.log('Processed courses:', courses);
        
        if (!Array.isArray(courses)) {
          console.error('Invalid response format:', {
            type: typeof courses,
            value: courses
          });
          setError('Invalid response format from server');
          return;
        }
        
        const validCourses = courses.filter(course => 
          course && course.title && course.description
        );
        console.log('Valid courses:', validCourses);
        
        if (validCourses.length === 0) {
          console.error('No valid courses found:', courses);
          setError('No valid courses found');
          return;
        }
        
        setCourses(validCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again.');
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
    return (
      <UIContainer>
        <h2>No courses available</h2>
      </UIContainer>
    );
  }

  return (
    <UIContainer>
      <UIGrid columns={3}>
        {courses.map(course => (
          <UIGrid.Column key={course._id}>
            <CourseCard course={course} />
          </UIGrid.Column>
        ))}
      </UIGrid>
    </UIContainer>
  );
};

export default Courses;

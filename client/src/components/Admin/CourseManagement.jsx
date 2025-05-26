import React, { useState, useEffect, useRef } from 'react';
import { Container, Grid, Header, Form, Icon, Table } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../api';

const CourseManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    image: '',
    level: 'beginner',
    category: '',
    duration: '',
    lessons: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth('/api/courses');
      // Handle nested response structure
      const courses = Array.isArray(response) ? response : response.data || [];
      setCourses(courses);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth('/api/courses', {
        method: 'POST',
        body: JSON.stringify(newCourse)
      });
      // Handle nested response structure
      const createdCourse = response.data;
      setCourses([...courses, createdCourse]);
      setNewCourse({ title: '', description: '', image: '', level: 'beginner', category: '', duration: '', lessons: [] });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (courseId, updates) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`/api/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      // Handle nested response structure
      const updatedCourse = response.data;
      setCourses(courses.map(course => 
        course._id === courseId ? updatedCourse : course
      ));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      setLoading(true);
      await fetchWithAuth(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });
      setCourses(courses.filter(course => course._id !== courseId));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header as='h1'>Course Management</Header>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <Grid columns={2} stackable>
        <Grid.Column>
          <Header as='h2'>Create New Course</Header>
          <Form>
            <Form.Field>
              <label>Title</label>
              <input
                placeholder='Course title'
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                required
              />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <textarea
                placeholder='Course description'
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                required
              />
            </Form.Field>
            <Form.Field>
              <label>Course Image URL</label>
              <input
                placeholder='Image URL'
                value={newCourse.image}
                onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
              />
            </Form.Field>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Category</label>
                <select
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                  className='ui fluid search dropdown'
                >
                  <option value=''>Select category</option>
                  <option value='programming'>Programming</option>
                  <option value='design'>Design</option>
                  <option value='business'>Business</option>
                </select>
              </Form.Field>
              <Form.Field>
                <label>Level</label>
                <select
                  value={newCourse.level}
                  onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                  className='ui fluid search dropdown'
                >
                  <option value=''>Select level</option>
                  <option value='beginner'>Beginner</option>
                  <option value='intermediate'>Intermediate</option>
                  <option value='advanced'>Advanced</option>
                </select>
              </Form.Field>
            </Form.Group>
            <Form.Field>
              <label>Duration</label>
              <input
                placeholder='Duration (e.g., 2 hours)'
                value={newCourse.duration}
                onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
              />
            </Form.Field>
            <button className='ui primary button' onClick={handleCreateCourse}>
              Create Course
            </button>
          </Form>
        </Grid.Column>

        <Grid.Column>
          <Header as='h2'>Existing Courses</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Level</Table.HeaderCell>
                <Table.HeaderCell>Duration</Table.HeaderCell>
                <Table.HeaderCell>Lessons</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
                {courses.map((course) => (
                  <Table.Row key={course._id}>
                  <Table.Cell>
                    <Header as='h4'>{course.title}</Header>
                    <p style={{ color: '#666' }}>{course.description}</p>
                  </Table.Cell>
                  <Table.Cell>{course.category}</Table.Cell>
                  <Table.Cell>{course.level}</Table.Cell>
                  <Table.Cell>{course.duration}</Table.Cell>
                  <Table.Cell>
                    <button
                      className='ui icon button blue'
                      onClick={() => navigate(`/admin/courses/${course._id}/lessons`)}
                    >
                      <i className='list layout icon' />
                      Manage Lessons
                    </button>
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      className='ui icon button yellow'
                      onClick={() => handleUpdateCourse(course._id, course)}
                    >
                      <i className='edit icon' />
                    </button>
                    <button
                      className='ui icon button red'
                      onClick={() => handleDeleteCourse(course._id)}
                    >
                      <i className='delete icon' />
                    </button>
                  </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default CourseManagement;

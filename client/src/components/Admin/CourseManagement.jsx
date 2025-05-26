import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Header, Form, Table, Icon } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../api';

const CourseManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
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
      const data = await fetchWithAuth('/api/admin/courses');
      setCourses(data);
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
      const data = await fetchWithAuth('/api/admin/courses', {
        method: 'POST',
        body: JSON.stringify(newCourse)
      });
      setCourses([...courses, data]);
      setNewCourse({ title: '', description: '', lessons: [] });
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
      const data = await fetchWithAuth(`/api/admin/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      setCourses(courses.map(course => 
        course._id === courseId ? data : course
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
      await fetchWithAuth(`/api/admin/courses/${courseId}`, {
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
              />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <textarea
                placeholder='Course description'
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              />
            </Form.Field>
            <Button primary onClick={handleCreateCourse} loading={loading}>
              Create Course
            </Button>
          </Form>
        </Grid.Column>

        <Grid.Column>
          <Header as='h2'>Existing Courses</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Lessons</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {courses.map((course) => (
                <Table.Row key={course._id}>
                  <Table.Cell>{course.title}</Table.Cell>
                  <Table.Cell>{course.description}</Table.Cell>
                  <Table.Cell>{course.lessons?.length || 0}</Table.Cell>
                  <Table.Cell>
                    <Button
                      icon
                      color='blue'
                      onClick={() => handleUpdateCourse(course._id, { title: 'Updated Title' })}
                    >
                      <Icon name='edit' />
                    </Button>
                    <Button
                      icon
                      color='red'
                      onClick={() => handleDeleteCourse(course._id)}
                    >
                      <Icon name='delete' />
                    </Button>
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

import React, { useState, useEffect, useRef } from 'react';
import { Container, Grid, Header, Form, Icon, Table, Button, Segment, Message } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const CourseManagement = () => {
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();
  const { toastSuccess, toastError } = useToast();
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

  useEffect(() => {
    fetchCourses().catch((err) => {
      toastError('Something went wrong');
    });
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth('/api/courses');
      console.log('Raw response:', response);
      
      // Handle direct array response
      const courses = Array.isArray(response) 
        ? response
        : response.data?.courses || [];
      
      console.log('Parsed courses:', courses);
      setCourses(courses);
    } catch (err) {
      console.error('Error fetching courses:', err);
      toastError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      setLoading(true);
      const createdCourse = await fetchWithAuth('/api/admin/courses', {
        method: 'POST',
        body: JSON.stringify({
          ...newCourse,
          lessons: newCourse.lessons || []
        })
      });
      if (createdCourse) {
        setCourses([...courses, createdCourse]);
        setNewCourse({ title: '', description: '', image: '', level: 'beginner', category: '', duration: '', lessons: [] });
      } else {
        throw new Error('Failed to create course');
      }
    } catch (error) {
      toastError(error?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (courseId, updates) => {
    try {
      setLoading(true);
      const updatedCourse = await fetchWithAuth(`/api/admin/courses/${encodeURIComponent(courseId)}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      setCourses(courses.map(course => 
        course._id === courseId ? updatedCourse : course
      ));
    } catch (error) {
      toastError('Failed to update course');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    setLoading(true);
    
    try {
      // Try to delete the course
      await fetchWithAuth(`/api/admin/courses/${courseId}`, {
        method: 'DELETE'
      });
      
      // If we got here without throwing, the request was successful
      toastSuccess?.('Course deleted successfully');
      setCourses(prev => prev.filter(c => c._id !== courseId));
    } catch (err) {
      console.error('Delete error occurred:', err);
      toastError?.('Failed to delete course');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <Header as='h1'>Course Management</Header>
      

      {loading ? (
        <div className='ui active inverted dimmer'>
          <div className='ui text loader'>Loading courses...</div>
        </div>
      ) : (
        <div style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
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
                      <option value='lindy-hop'>Lindy Hop</option>
                      <option value='solo-jazz'>Solo Jazz</option>
                      <option value='rhythm-and-blues'>Rhythm and Blues</option>
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
              {courses.length > 0 ? (
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Title & Description</Table.HeaderCell>
                      <Table.HeaderCell>Category</Table.HeaderCell>
                      <Table.HeaderCell>Level</Table.HeaderCell>
                      <Table.HeaderCell>Duration</Table.HeaderCell>
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
                            className='ui icon button yellow'
                            onClick={() => {
                              const updates = {
                                title: course.title,
                                description: course.description,
                                category: course.category,
                                level: course.level,
                                duration: course.duration
                              };
                              handleUpdateCourse(course._id, updates);
                            }}
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
              ) : (
                <Message info>
                  <Message.Header>No courses found</Message.Header>
                  <p>Create a new course to get started!</p>
                </Message>
              )}
            </Grid.Column>
          </Grid>
        </div>
      )}
    </Container>
  );
};

export default CourseManagement;

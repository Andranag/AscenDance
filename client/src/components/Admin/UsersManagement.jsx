import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Icon } from 'semantic-ui-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const UsersManagement = () => {
  const { toastSuccess, toastError } = useToast();
  const { user, token, logout, fetchWithAuth } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    if (editUser) {
      setFormValues({
        name: editUser.name,
        email: editUser.email,
        role: editUser.role
      });
    }
  }, [editUser]);

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toastError('You must be an admin to access this page');
      window.location.href = '/';
      return;
    }
    console.log('User token:', token);
    fetchUsers().catch((err) => {
      toastError('Something went wrong');
    });
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth('/api/admin/users');
      if (response === null) {
        toastError('No users found');
        setUsers([]);
      } else {
        setUsers(response);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toastError(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!editUser) {
      toastError('No user selected');
      return;
    }

    const updates = {
      name: formValues.name || editUser.name,
      email: formValues.email || editUser.email,
      role: formValues.role || editUser.role
    };

    console.log('Updates to send:', updates);
    handleUpdateUser(editUser._id, updates);
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      setLoading(true);
      console.log('=== Making API Request ===');
      console.log('User ID:', userId);
      console.log('Updates:', updates);
      
      const response = await fetchWithAuth(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      
      console.log('=== API Response ===');
      console.log('Response:', response);
      
      if (response.error) {
        console.error('API Error:', response);
        throw new Error(response.error || 'Failed to update user');
      }

      // Update the editUser state with the new data
      setEditUser(response.data);
      
      toastSuccess('User updated successfully');
      setEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('=== Error Details ===');
      console.error('Error:', error);
      console.error('Error Message:', error.message);
      toastError(error.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setLoading(true);
      await fetchWithAuth(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      toastSuccess('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toastError(error.response?.data?.error || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => (
            <Table.Row key={user._id}>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
              <Table.Cell>
                <Button.Group>
                  <Button
                    icon
                    color="blue"
                    onClick={() => handleEdit(user)}
                  >
                    <Icon name="edit" />
                  </Button>
                  <Button
                    icon
                    color="red"
                    onClick={() => handleDelete(user._id)}
                  >
                    <Icon name="trash" />
                  </Button>
                </Button.Group>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        size="small"
      >
        <Modal.Header>Edit User</Modal.Header>
        <Modal.Content>
          <Form id="userForm" onSubmit={handleFormSubmit}>
            <Form.Field>
              <label>Name</label>
              <input
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Form.Field>
            <Form.Field>
              <label>Email</label>
              <input
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Form.Field>
            <Form.Field>
              <label>Role</label>
              <select
                name="role"
                value={formValues.role}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setEditModalOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="userForm"
            positive
            loading={loading}
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              console.log('Save button clicked');
              handleFormSubmit(e);
            }}
          >
            Save Changes
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default UsersManagement;

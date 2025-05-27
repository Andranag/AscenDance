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

  const handleUpdateRole = async (userId, role) => {
    try {
      setLoading(true);
      await fetchWithAuth(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role })
      });
      toastSuccess('User role updated successfully');
      setEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toastError(error.response?.data?.error || 'Failed to update user role');
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
                <Button
                  icon
                  color="blue"
                  onClick={() => handleEdit(user)}
                  disabled={loading}
                >
                  <Icon name="edit" />
                </Button>
                <Button
                  icon
                  color="red"
                  onClick={() => handleDelete(user._id)}
                  disabled={loading}
                >
                  <Icon name="trash" />
                </Button>
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
        <Modal.Header>Edit User Role</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Role</label>
              <select
                value={editUser?.role || ''}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
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
            positive
            onClick={() => handleUpdateRole(editUser._id, editUser.role)}
            loading={loading}
          >
            Save Changes
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default UsersManagement;

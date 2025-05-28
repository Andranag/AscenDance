import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

const UsersManagement = () => {
  const { toastSuccess, toastError } = useToast();
  const { user, token, fetchWithAuth } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: '', email: '', role: 'user' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toastError('You must be an admin to access this page');
      window.location.href = '/';
      return;
    }
    console.log('User token:', token);
    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (editUser) {
      setFormValues({
        name: editUser.name,
        email: editUser.email,
        role: editUser.role
      });
    } else {
      setFormValues({ name: '', email: '', role: 'user' });
    }
  }, [editUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth('/api/admin/users');
      if (response?.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        toastError('Invalid response format');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toastError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editUser ? 'PUT' : 'POST';
      const url = editUser ? `/api/admin/users/${editUser._id}` : '/api/admin/users';

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(formValues)
      });

      if (response.success) {
        toastSuccess(editUser ? 'User updated successfully' : 'User created successfully');
        setEditModalOpen(false);
        setEditUser(null);
        fetchUsers();
      } else {
        throw new Error(response.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toastError('Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetchWithAuth(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      if (response.success) {
        toastSuccess('User deleted successfully');
        fetchUsers();
      } else {
        throw new Error(response.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toastError('Failed to delete user');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <button
          onClick={() => {
            setEditUser(null);
            setEditModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleEdit(user)} className="btn-secondary flex items-center gap-1">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete(user._id)} className="btn-danger flex items-center gap-1 ml-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={(e) => e.target === e.currentTarget && setEditModalOpen(false)}>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold mb-4">
                  {editUser ? 'Edit User' : 'Add User'}
                </h3>
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formValues.name}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      name="role"
                      value={formValues.role}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button type="submit" className="btn-primary flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      {editUser ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(false)}
                      className="btn-secondary flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;

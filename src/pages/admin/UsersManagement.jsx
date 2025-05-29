import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, Loader, Shield, User, X, Eye, EyeOff } from 'lucide-react';
import { userService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toastSuccess, toastError } = useToast();
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const roles = ['user', 'admin'].sort();

  useEffect(() => {
    if (editingUser) {
      setFormData({
        ...editingUser,
        password: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
    }
  }, [editingUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAllUsers();
        if (!response?.success) {
          throw new Error(response?.message || 'Failed to fetch users');
        }
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toastError(error.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = users ? [...users].sort((a, b) => {
    const aValue = a[sortField]?.toString().toLowerCase() || '';
    const bValue = b[sortField]?.toString().toLowerCase() || '';
    return sortDirection === 'asc' 
      ? aValue.localeCompare(bValue) 
      : bValue.localeCompare(aValue);
  }) : [];

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setUsers(users.filter(user => user._id !== userId));
        await userService.deleteUser(userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const toggleRole = async (userId) => {
    try {
      const updatedUsers = users.map(user =>
        user._id === userId
          ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' }
          : user
      );
      setUsers(updatedUsers);
      await userService.toggleRole(userId);
    } catch (error) {
      console.error('Error toggling user role:', error);
      setUsers(users); // revert if error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingUser && !formData.password) {
      alert('Password is required for new users');
      return;
    }

    try {
      const updatedData = editingUser
        ? { ...formData, ...(formData.password ? { password: formData.password } : {}) }
        : formData;

      if (editingUser) {
        await userService.updateUser(editingUser._id, updatedData);
        setUsers(users.map(user =>
          user._id === editingUser._id
            ? { ...user, ...formData }
            : user
        ));
      } else {
        const response = await userService.createUser(formData);
        setUsers([...users, response.data]);
      }

      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.message || 'Failed to save user');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const SortButton = ({ field, children }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-primary">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-6">

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="text-white/80 mt-1">Manage your dance community members</p>
            </div>
            <button
              onClick={() => {
                setEditingUser(null);
                setIsModalOpen(true);
              }}
              className="btn-primary hover:scale-105 transform transition-transform duration-200 shadow-lg hover:shadow-xl bg-white text-primary hover:bg-white/90"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add New User</span>
            </button>
          </div>

          {/* User Table */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-white/20">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <SortButton field="name">User</SortButton>
                    <SortButton field="role">Role</SortButton>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleRole(user._id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            user.role === 'admin'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          {user.role}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="group relative inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-all duration-200 hover:shadow-md"
                            title="Edit user"
                          >
                            <Pencil className="w-4 h-4 mr-1.5 transition-transform group-hover:scale-110" />
                            <span className="font-medium">Edit</span>
                            <span className="absolute inset-0 rounded-md border-2 border-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="group relative inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-all duration-200 hover:shadow-md"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4 mr-1.5 transition-transform group-hover:scale-110" />
                            <span className="font-medium">Delete</span>
                            <span className="absolute inset-0 rounded-md border-2 border-red-200 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingUser ? 'Edit User' : 'Add New User'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field mt-1 pr-10"
                        required={!editingUser}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-[60%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="input-field mt-1"
                      required
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingUser ? 'Update User' : 'Create User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsersManagement;

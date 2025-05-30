import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, User } from 'lucide-react';
import { userService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import UserModal from '../../components/modals/UserModal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toastSuccess, toastError } = useToast();
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const roles = ['user', 'admin'].sort();

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleDelete = (userId) => {
    setSelectedUserId(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await userService.deleteUser(selectedUserId);
      // Refetch users to ensure we have the latest data
      const response = await userService.getAllUsers();
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch users');
      }
      setUsers(response.data);
      toastSuccess('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toastError(error.message || 'Failed to delete user');
    } finally {
      setShowDeleteModal(false);
      setSelectedUserId(null);
    }
  };

  const handleUserSaved = async (user) => {
    // Refetch users to ensure we have the latest data
    const response = await userService.getAllUsers();
    if (!response?.success) {
      throw new Error(response?.message || 'Failed to fetch users');
    }
    setUsers(response.data);
  };

  const toggleRole = async (userId) => {
    try {
      if (!userId) {
        throw new Error('Invalid user ID');
      }

      // Make API call first to get the updated user data
      const updatedUserData = await userService.toggleRole(userId);

      // Update local state with the backend response
      setUsers(users.map(user =>
        user._id === userId
          ? { ...user, ...updatedUserData }
          : user
      ));
      
      // Refetch users to ensure we have the latest data
      const response = await userService.getAllUsers();
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch users');
      }
      setUsers(response.data);

      toastSuccess('Role updated successfully');
    } catch (error) {
      console.error('Error toggling user role:', error);
      toastError(error.message || 'Failed to toggle user role');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!editingUser && !formData.password) {
        toastError('Password is required for new users');
        return;
      }

      if (!editingUser) {
        // Create new user
        const createdUser = await userService.createUser(formData);
        setUsers([...users, createdUser]);
        toastSuccess('User created successfully');
      } else {
        // Update existing user
        if (!editingUser) {
          throw new Error('Invalid user ID');
        }

        const updatedData = { ...formData };
        if (!formData.password) {
          delete updatedData.password;
        }

        console.log('Sending update to server:', {
          userId: editingUser._id,
          data: updatedData
        });

        const updatedUserData = await userService.updateUser(editingUser._id, updatedData);
        setUsers(users.map(user =>
          user._id === editingUser._id
            ? { ...user, ...updatedUserData }
            : user
        ));
        
        // Refetch users to ensure we have the latest data
        const response = await userService.getAllUsers();
        if (!response?.success) {
          throw new Error(response?.message || 'Failed to fetch users');
        }
        setUsers(response.data);
        toastSuccess('User updated successfully');
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
      toastError(error.message || 'Failed to save user');
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
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <button
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New User</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-4">
              <div></div>
            </div>

            {/* User Table */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-white/20">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <SortButton field="name">Name</SortButton>
                      <SortButton field="email">Email</SortButton>
                      <SortButton field="role">Role</SortButton>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedUsers.map((user) => (
                      <tr key={`user-row-${user._id}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-primary text-white' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-primary hover:text-primary-dark"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUserId(null);
        }}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={confirmDelete}
        confirmText="Delete User"
        cancelText="Cancel"
        type="danger"
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSubmit={handleUserSaved}
      />
    </>
  );
};

export default UsersManagement;

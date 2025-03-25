import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  SearchIcon, 
  FilterIcon,
  ExclamationCircleIcon,
  XIcon,
  CheckIcon,
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon
} from '@heroicons/react/solid';
import axios from 'axios';

// User interface to match your backend model
interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  date_joined: string;
  is_active: boolean;
}

// API response type
interface ApiResponse<T> {
  status?: string;
  data?: T;
  message?: string;
  pagination?: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

// Error type for form validation
interface FormErrors {
  email?: string[];
  first_name?: string[];
  last_name?: string[];
  password?: string[];
  role?: string[];
  is_active?: string[];
  non_field_errors?: string[];
  detail?: string;
  [key: string]: string[] | string | undefined;
}

// Initial form state
const initialFormData = {
  id: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  role: 'patient',
  is_active: true
};

export default function UserManagement() {
  // State for users data
  const [allUsers, setAllUsers] = useState<UserData[]>([]); // All users from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Add this to your component's state
const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());
  // State for user form
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Pagination state (now for client-side pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Message display
  const [message, setMessage] = useState({
    text: '',
    type: '' // 'success' or 'error'
  });
  
  // Confirmation modal for delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);




  // API base URL - should match your Django backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  
  // Headers for API requests
  const getHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch all users from API (only once)
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // Make the API request without any filters
      const response = await axios.get<ApiResponse<UserData[]>>(
        `${API_URL}/admin/users/`,
        { headers: getHeaders() }
      );
      
      if (response.data && response.data.data) {
        setAllUsers(response.data.data || []);
      } else {
        setError('Unexpected data format from server');
      }
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      setError(error.response?.data?.message || 'Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Initial data fetch - only once when component mounts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Client-side filtering for search and role filter
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      // Apply search term filter (case insensitive)
      const searchMatch = searchTerm === '' || 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply role filter
      const roleMatch = roleFilter === '' || user.role === roleFilter;
      
      // User must match both filters
      return searchMatch && roleMatch;
    });
  }, [allUsers, searchTerm, roleFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  // Parse API error responses into friendly messages
  const parseErrorResponse = (error: any): FormErrors => {
    const formErrors: FormErrors = {};
    
    if (!error.response || !error.response.data) {
      formErrors.non_field_errors = ['Network error. Please try again.'];
      return formErrors;
    }
    
    const data = error.response.data;
    
    // Handle different error formats from DRF
    if (typeof data === 'string') {
      formErrors.non_field_errors = [data];
    } else if (data.detail) {
      formErrors.detail = data.detail;
    } else {
      // Process field errors
      Object.entries(data).forEach(([field, errors]) => {
        if (Array.isArray(errors)) {
          formErrors[field as keyof FormErrors] = errors;
        } else if (typeof errors === 'string') {
          formErrors[field as keyof FormErrors] = [errors];
        }
      });
    }
    
    // Special handling for password validation from Django's min_length validator
    if (data.password && Array.isArray(data.password)) {
      const passwordError = data.password.find((err: string | string[]) => err.includes('min_length'));
      if (passwordError) {
        formErrors.password = ['Password must be at least 5 characters long'];
      }
    }
    
    return formErrors;
  };

  // Handle form input changes
// Update the handleInputChange function to track modified fields when editing
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value, type } = e.target;
  
  // Handle checkbox for is_active
  if (type === 'checkbox') {
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: checked }));
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
  
  // Track modified fields when editing an existing user
  if (isEditing) {
    // For password, only mark as modified if not empty
    if (name === 'password' && (!value || value.trim() === '')) {
      const newModifiedFields = new Set(modifiedFields);
      newModifiedFields.delete(name);
      setModifiedFields(newModifiedFields);
    } else {
      setModifiedFields(prev => {
        const newSet = new Set(prev);
        newSet.add(name);
        return newSet;
      });
    }
  }
 // Clear error for this field when user types
 if (formErrors[name as keyof FormErrors]) {
  setFormErrors(prev => ({
    ...prev,
    [name]: undefined
  }));
}
};

// Reset the modified fields when the form is reset

const resetForm = () => {
  setFormData(initialFormData);
  setFormErrors({});
  setIsEditing(false);
  setShowForm(false);
  setModifiedFields(new Set()); // Reset modified fields
};

// Reset modified fields when opening form for editing


  // Validate form before submission
// Update the form validation function to handle optional password for existing users
const validateForm = (): boolean => {
  const errors: FormErrors = {};
  
  if (!formData.email) {
    errors.email = ['Email is required'];
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = ['Please enter a valid email address'];
  }
  
  if (!formData.first_name.trim()) {
    errors.first_name = ['First name is required'];
  }
  
  if (!formData.last_name.trim()) {
    errors.last_name = ['Last name is required'];
  }
  
  // Password validation - only required for new users
  if (!isEditing && !formData.password) {
    errors.password = ['Password is required for new users'];
  } else if (formData.password && formData.password.length > 0 && formData.password.length < 5) {
    // Only validate non-empty passwords
    errors.password = ['Password must be at least 5 characters long'];
  }
  
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

// Update the handleSubmit function to properly handle password updates
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  try {
    if (isEditing) {
      // Update existing user
      const { id, password, ...updateData } = formData;
      
      // Only include password if it was provided (not empty)
      const dataToSend: Record<string, any> = { ...updateData };
      if (password && password.trim() !== '') {
        dataToSend.password = password;
      }
      
      const response = await axios.put<ApiResponse<UserData>>(
        `${API_URL}/admin/users/${id}/`, 
        dataToSend,
        { headers: getHeaders() }
      );
      
      const responseData = response.data;
      
      if (responseData && responseData.status === 'success') {
        setMessage({
          text: 'User updated successfully!',
          type: 'success'
        });
        resetForm();
        fetchUsers(); // Refresh all users
      }
    } else {
      // Create new user - no changes needed here
      const response = await axios.post<ApiResponse<UserData>>(
        `${API_URL}/admin/users/`, 
        formData,
        { headers: getHeaders() }
      );
      
      const responseData = response.data;
      
      if (responseData && responseData.status === 'success') {
        setMessage({
          text: 'User created successfully!',
          type: 'success'
        });
        resetForm();
        fetchUsers(); // Refresh all users
      }
    }
  } catch (error: any) {
    console.error('Error submitting user form:', error);
    
    // Parse error response
    const errors = parseErrorResponse(error);
    setFormErrors(errors);
    
    // Set general error message
    if (errors.non_field_errors || errors.detail) {
      setMessage({
        text: errors.non_field_errors?.[0] || errors.detail || 'Error saving user. Please check the form and try again.',
        type: 'error'
      });
    }
  }
};

  // Edit user
// Reset modified fields when opening form for editing
const handleEdit = (user: UserData) => {
  setFormData({
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    password: '', // Don't populate password for security
    role: user.role,
    is_active: user.is_active
  });
  setFormErrors({});
  setIsEditing(true);
  setShowForm(true);
  setModifiedFields(new Set()); // Reset modified fields tracking
};

  // Delete user confirmation
  const handleDeleteClick = (user: UserData) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Confirm delete user
  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      const response = await axios.delete<ApiResponse<null>>(
        `${API_URL}/admin/users/${userToDelete.id}/`,
        { headers: getHeaders() }
      );
      
      const responseData = response.data;
      
      if (responseData && responseData.status === 'success') {
        setMessage({
          text: 'User deleted successfully!',
          type: 'success'
        });
        fetchUsers(); // Refresh all users
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setMessage({
        text: error.response?.data?.message || 'Error deleting user. Please try again.',
        type: 'error'
      });
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Pagination is reset in useEffect
  };

  // Handle role filter change
  const handleRoleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    // Pagination is reset in useEffect
  };

  // Clear search and filters
  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setCurrentPage(1);
  };

  // Get role label
  const getRoleLabel = (role: string): string => {
    const roles: Record<string, string> = {
      admin: 'Administrator',
      doctor: 'Doctor',
      patient: 'Patient',
      nurse: 'Nurse',
      radiologist: 'Radiologist',
      department_head: 'Department Head'
    };
    return roles[role] || role;
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheckIcon className="h-4 w-4 mr-1" />;
      case 'doctor':
      case 'radiologist':
      case 'department_head':
        return <UserIcon className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Message notification */}
      {message.text && (
        <div className={`rounded-md ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'} p-4 mb-4 animate-fadeIn`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <CheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              ) : (
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {message.text}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setMessage({ text: '', type: '' })}
                  className={`inline-flex rounded-md p-1.5 ${
                    message.type === 'success' 
                      ? 'bg-green-50 text-green-500 hover:bg-green-100' 
                      : 'bg-red-50 text-red-500 hover:bg-red-100'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    message.type === 'success' ? 'focus:ring-green-500' : 'focus:ring-red-500'
                  }`}
                >
                  <span className="sr-only">Dismiss</span>
                  <XIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {/* Filter by role */}
          <div className="relative w-full md:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FilterIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={roleFilter}
              onChange={handleRoleFilter}
            >
              <option value="">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
              <option value="nurse">Nurse</option>
              <option value="radiologist">Radiologist</option>
              <option value="department_head">Department Head</option>
            </select>
          </div>
          
          {/* Clear filters button - only show when filters are active */}
          {(searchTerm || roleFilter) && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <XIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
              Clear Filters
            </button>
          )}
        </div>
        
        {/* Add User Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add User
          </button>
        </div>
      </div>

      {/* Search results info */}
      {(searchTerm || roleFilter) && (
        <div className="mb-4 px-1">
          <div className="text-sm text-gray-700">
            Found <span className="font-medium">{filteredUsers.length}</span> 
            {filteredUsers.length === 1 ? ' user' : ' users'}
            {searchTerm && <span> matching "<span className="font-medium">{searchTerm}</span>"</span>}
            {roleFilter && <span> with role "<span className="font-medium">{getRoleLabel(roleFilter)}</span>"</span>}
          </div>
        </div>
      )}

      {/* User Form */}
      {showForm && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {isEditing ? 'Edit User' : 'Create New User'}
                  </h3>
                  
                  {/* Form content (unchanged) */}
                  {/* ...form fields... */}
                  
                  {/* Non-field errors */}
                  {(formErrors.non_field_errors || formErrors.detail) && (
                    <div className="mt-2 rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            {formErrors.non_field_errors?.[0] || formErrors.detail}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className={`block w-full pr-10 border ${
                            formErrors.email ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                          } rounded-md shadow-sm py-2 px-3 sm:text-sm`}
                          placeholder="user@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {formErrors.email && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      {formErrors.email && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.email[0]}</p>
                      )}
                    </div>
                    
                    {/* First Name */}
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          className={`block w-full pr-10 border ${
                            formErrors.first_name ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                          } rounded-md shadow-sm py-2 px-3 sm:text-sm`}
                          value={formData.first_name}
                          onChange={handleInputChange}
                        />
                        {formErrors.first_name && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      {formErrors.first_name && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.first_name[0]}</p>
                      )}
                    </div>
                    
                    {/* Last Name */}
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          className={`block w-full pr-10 border ${
                            formErrors.last_name ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                          } rounded-md shadow-sm py-2 px-3 sm:text-sm`}
                          value={formData.last_name}
                          onChange={handleInputChange}
                        />
                        {formErrors.last_name && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      {formErrors.last_name && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.last_name[0]}</p>
                      )}
                    </div>
                    
                    {/* Password */}
                    <div>
  <label htmlFor="password" className="block text-sm font-medium text-gray-700 items-center">
    Password 
    {isEditing && (
      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Optional
      </span>
    )}
  </label>
  <div className="mt-1 relative rounded-md shadow-sm">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
    </div>
    <input
      type="password"
      name="password"
      id="password"
      className={`block w-full pl-10 pr-10 border ${
        formErrors.password ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
      } rounded-md shadow-sm py-2 px-3 sm:text-sm`}
      placeholder={isEditing ? "Leave blank to keep current" : "Minimum 5 characters"}
      value={formData.password}
      onChange={handleInputChange}
      required={!isEditing}
    />
    {formErrors.password && (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
      </div>
    )}
  </div>
  {formErrors.password && (
    <p className="mt-2 text-sm text-red-600">{formErrors.password[0]}</p>
  )}
  {!formErrors.password && (
    <p className="mt-2 text-xs text-gray-500">
      {isEditing 
        ? "Leave the password field blank to keep the user's current password." 
        : "Password must be at least 5 characters long."}
    </p>
  )}
</div>
                    
                    {/* Role */}
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                      <select
                        id="role"
                        name="role"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="admin">Administrator</option>
                        <option value="doctor">Doctor</option>
                        <option value="patient">Patient</option>
                        <option value="nurse">Nurse</option>
                        <option value="radiologist">Radiologist</option>
                        <option value="department_head">Department Head</option>
                      </select>
                      {formErrors.role && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.role[0]}</p>
                      )}
                    </div>
                    
                    {/* Active Status */}
                    <div className="flex items-center">
                      <input
                        id="is_active"
                        name="is_active"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                        Active Account
                      </label>
                    </div>
                    
                    {/* Form Actions */}
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-150"
                      >
                        {isEditing ? 'Update User' : 'Create User'}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm transition duration-150"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete User</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete <span className="font-semibold">{userToDelete.first_name} {userToDelete.last_name}</span>? This action cannot be undone and all data associated with this user will be permanently removed.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : currentUsers.length === 0 ? (
            <div className="text-center py-10">
              {filteredUsers.length === 0 ? (
                searchTerm || roleFilter ? (
                  <div>
                    <p className="text-gray-500">No users found matching your filters</p>
                    <button
                      onClick={clearFilters}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">No users found in the system.</p>
                )
              ) : (
                <p className="text-gray-500">No users on this page.</p>
              )}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'doctor' 
                          ? 'bg-blue-100 text-blue-800'
                          : user.role === 'radiologist' || user.role === 'department_head'
                          ? 'bg-indigo-100 text-indigo-800'
                          : user.role === 'nurse'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getRoleIcon(user.role)}
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <span className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'} mr-1`}></span>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.date_joined).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition duration-150"
                          title="Edit user"
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150"
                          title="Delete user"
                        >
                          <TrashIcon className="h-5 w-5" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === totalPages 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredUsers.length > 0 ? indexOfFirstItem + 1 : 0}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                    currentPage === 1 
                      ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                      : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Generate page buttons */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum: number;
                  
                  // Calculate which page numbers to show
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                    currentPage === totalPages 
                      ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                      : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
      

    </div>
  );
}
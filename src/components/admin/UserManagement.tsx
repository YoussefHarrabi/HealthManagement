import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Table from '../common/Table';
import Modal from '../common/Modal';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

interface FormData {
  id?: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'active'
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Mock data fetching
  useEffect(() => {
    // In a real app, this would be an API call
    const mockUsers: User[] = [
      {
        id: 1,
        name: 'Dr. John Smith',
        email: 'john.smith@healthcare.com',
        role: 'doctor',
        department: 'Cardiology',
        status: 'active',
        lastLogin: '2025-03-08 14:32:15'
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@healthcare.com',
        role: 'nurse',
        department: 'Emergency',
        status: 'active',
        lastLogin: '2025-03-08 08:45:22'
      },
      {
        id: 3,
        name: 'Robert Johnson',
        email: 'robert.johnson@healthcare.com',
        role: 'admin',
        department: 'Administration',
        status: 'active',
        lastLogin: '2025-03-08 12:15:45'
      },
      {
        id: 4,
        name: 'Emily Chen',
        email: 'emily.chen@healthcare.com',
        role: 'doctor',
        department: 'Neurology',
        status: 'inactive',
        lastLogin: '2025-02-28 16:20:10'
      },
      {
        id: 5,
        name: 'Michael Brown',
        email: 'michael.brown@healthcare.com',
        role: 'radiologist',
        department: 'Radiology',
        status: 'active',
        lastLogin: '2025-03-08 09:30:40'
      }
    ];
    
    setUsers(mockUsers);
    setIsLoading(false);
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === formData.id ? { ...user, ...formData } : user
      ));
    } else {
      // Add new user
      const newUser: User = {
        id: Math.max(0, ...users.map(u => u.id)) + 1,
        ...formData,
        lastLogin: 'Never'
      };
      setUsers([...users, newUser]);
    }
    
    // Reset form and close modal
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      status: 'active'
    });
    setIsEditing(false);
    setIsModalOpen(false);
  };

  // Open edit modal
  const handleEdit = (user: User) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const handleDeleteConfirm = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  // Delete user
  const handleDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setUserToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      status: 'active'
    });
    setIsEditing(false);
  };

  // Open modal to add new user
  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Table columns configuration
  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Role', accessor: 'role' },
    { Header: 'Department', accessor: 'department' },
    { 
      Header: 'Status', 
      accessor: 'status',
      Cell: ({ value }: { value: string }) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    { Header: 'Last Login', accessor: 'lastLogin' },
  ];

  // Row actions
  const userActions = (user: User) => (
    <div className="flex space-x-2">
      <Button
        variant="white"
        size="sm"
        icon={<PencilIcon className="h-4 w-4" />}
        onClick={() => handleEdit(user)}
      >
        Edit
      </Button>
      <Button
        variant="danger"
        size="sm"
        icon={<TrashIcon className="h-4 w-4" />}
        onClick={() => handleDeleteConfirm(user)}
      >
        Delete
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">User Management</h2>
        <Button
          variant="primary"
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={handleOpenAddModal}
        >
          Add User
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Table
            data={users}
            columns={columns}
            actions={userActions}
          />
        )}
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title={isEditing ? "Edit User" : "Add New User"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="input-field mt-1"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input-field mt-1"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              className="input-field mt-1"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="patient">Patient</option>
              <option value="radiologist">Radiologist</option>
            </select>
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              id="department"
              name="department"
              className="input-field mt-1"
              value={formData.department}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Department</option>
              <option value="Administration">Administration</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Emergency">Emergency</option>
              <option value="Neurology">Neurology</option>
              <option value="Oncology">Oncology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Radiology">Radiology</option>
              <option value="Surgery">Surgery</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="input-field mt-1"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="pt-5 flex justify-end space-x-3">
            <Button 
              variant="white"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary"
            >
              {isEditing ? 'Update User' : 'Add User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmOpen}
        setOpen={setDeleteConfirmOpen}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
          </p>
          <div className="pt-3 flex justify-end space-x-3">
            <Button 
              variant="white"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
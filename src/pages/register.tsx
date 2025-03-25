import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { UserAddIcon, ExclamationCircleIcon, CheckCircleIcon, XIcon } from '@heroicons/react/solid';
import AuthService, { User } from '../services/auth';

type RegisterProps = {
  login: (userData: User) => void;
  user: User | null;
};

export default function Register({ login, user }: RegisterProps) {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
  });
  
  const [errors, setErrors] = useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
    general?: string;
  }>({});
  
  const [loading, setLoading] = useState<boolean>(false);
  const [roles, setRoles] = useState<{value: string, label: string}[]>([]);
  const [rolesLoading, setRolesLoading] = useState<boolean>(true);
  
  // Success notification state
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  const router = useRouter();
  


  // Redirect if already logged in
  if (user) {
    router.push('/dashboard');
    return null;
  }
  
  // Fetch available roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await AuthService.getRoles();
        
        // Filter out admin role if it exists
        const filteredRoles = ((response as { data: { value: string, label: string }[] }).data || []).filter(role => role.value !== 'admin');
        
        setRoles(filteredRoles);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        
        // Fallback roles without admin
        setRoles([
          { value: 'doctor', label: 'Doctor' },
          { value: 'patient', label: 'Patient' },
          { value: 'nurse', label: 'Nurse' },
          { value: 'radiologist', label: 'Radiologist' },
          { value: 'department_head', label: 'Department Head' }
        ]);
      } finally {
        setRolesLoading(false);
      }
    };
    
    fetchRoles();
  }, []);

  // Auto-redirect after successful registration
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccess, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Extract data for registration (excluding confirmPassword)
      const { confirmPassword, ...registrationData } = formData;
      
      // Call the API to register the user
      const response = await AuthService.register(registrationData);
      
      // Show success message
      setShowSuccess(true);
      
      // Form will be cleared and user will be redirected automatically via useEffect
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Display error message
      setErrors({
        general: error.message || 'Registration failed. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login">
            <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
              sign in to your existing account
            </span>
          </Link>
        </p>
      </div>

      {/* Success toast notification */}
      {showSuccess && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-50 p-4 rounded-md shadow-lg border border-green-100 flex items-start max-w-md">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-green-800">
                Registration successful!
              </p>
              <p className="mt-1 text-sm text-green-700">
                Your account has been created. You will be redirected to login...
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-green-50 rounded-md inline-flex text-green-400 hover:text-green-500 focus:outline-none"
                onClick={() => setShowSuccess(false)}
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.general && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errors.general}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="mt-1">
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.first_name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.first_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.first_name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div className="mt-1">
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.last_name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.last_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={rolesLoading}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                >
                  {rolesLoading ? (
                    <option>Loading roles...</option>
                  ) : (
                    roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))
                  )}
                </select>
              </div>
              {/* <p className="mt-2 text-xs text-gray-500">
                Note: Healthcare provider accounts require verification and approval
              </p> */}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || rolesLoading || showSuccess}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading || rolesLoading || showSuccess ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <UserAddIcon className="mr-2 h-5 w-5" />
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  By registering, you agree to our
                </span>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              <Link href="#">
                <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                  Terms of Service
                </span>
              </Link>{' '}
              and{' '}
              <Link href="#">
                <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                  Privacy Policy
                </span>
              </Link>
            </div>
          </div>
        </div>
        
     
      </div>
    </div>
  );
}
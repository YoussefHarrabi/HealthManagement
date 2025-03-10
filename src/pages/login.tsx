import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LockClosedIcon, ExclamationCircleIcon } from '@heroicons/react/solid';

type LoginProps = {
  login: (userData: {
    id: string;
    name: string;
    email: string;
    role: string;
  }) => void;
  user: any;
};

export default function Login({ login, user }: LoginProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const router = useRouter();

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // Basic validation
    if (!email || !password) {
      setErrorMessage('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      // In a real app, this would call an API to authenticate
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in a real app this would be a server response
      if (email === 'admin@healthcare.com' && password === 'admin123') {
        login({
          id: '1',
          name: 'Admin User',
          email: 'admin@healthcare.com',
          role: 'admin'
        });
        router.push('/dashboard/admin');
      } else if (email === 'doctor@healthcare.com' && password === 'doctor123') {
        login({
          id: '2',
          name: 'Doctor User',
          email: 'doctor@healthcare.com',
          role: 'doctor'
        });
        router.push('/dashboard/doctor');
      } else if (email === 'radiologist@healthcare.com' && password === 'radiologist123') {
        login({
          id: '3',
          name: 'Radiologist User',
          email: 'radiologist@healthcare.com',
          role: 'radiologist'
        });
        router.push('/dashboard/radiologist');
      } else if (email === 'depthead@healthcare.com' && password === 'depthead123') {
        login({
          id: '4',
          name: 'Department Head',
          email: 'depthead@healthcare.com',
          role: 'department-head'
        });
        router.push('/dashboard/department-head');
      } else if (email === 'patient@healthcare.com' && password === 'patient123') {
        login({
          id: '5',
          name: 'Patient User',
          email: 'patient@healthcare.com',
          role: 'patient'
        });
        router.push('/dashboard/patient');
      } else if (email === 'nurse@healthcare.com' && password === 'nurse123') {
        login({
          id: '6',
          name: 'Nurse User',
          email: 'nurse@healthcare.com',
          role: 'nurse'
        });
        router.push('/dashboard/nurse');
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      setErrorMessage('An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/register">
              <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                create a new account
              </span>
            </Link>
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {errorMessage}
                </h3>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
    
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
    
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>
    
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
              </span>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
    
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Test Accounts</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3">
            <div className="text-sm text-gray-500 text-center">
              <p><strong>Admin:</strong> admin@healthcare.com / admin123</p>
              <p><strong>Doctor:</strong> doctor@healthcare.com / doctor123</p>
              <p><strong>Patient:</strong> patient@healthcare.com / patient123</p>
              <p><strong>Nurse:</strong> nurse@healthcare.com / nurse123</p>
              <p><strong>Radiologist:</strong> radiologist@healthcare.com / radiologist123</p>
              <p><strong>Department Head:</strong> depthead@healthcare.com / depthead123</p>
            </div>
          </div>
        </div>
    
        <div className="mt-6 text-center text-xs text-gray-500">
          System Last Updated: 2025-03-09 03:55:55 UTC | 
          Developer: YoussefHarrabi
        </div>
      </div>
    </div>
  );
}
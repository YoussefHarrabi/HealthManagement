import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  UserGroupIcon,
  ClipboardListIcon,
  ChartBarIcon,
  CogIcon,
  LogoutIcon,
  HomeIcon,
} from '@heroicons/react/outline';
import Link from 'next/link';

type DashboardProps = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  logout: () => void;
};

export default function Dashboard({ user, logout }: DashboardProps) {
  const router = useRouter();


  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      // Redirect to role-specific dashboard
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user.role === 'department-head') {
        router.push('/dashboard/department-head');
      } else if (user.role === 'radiologist') {
        router.push('/dashboard/radiologist');
      } else if (user.role === 'doctor') {
        router.push('/dashboard/doctor');
      } else if (user.role === 'patient') {
        router.push('/dashboard/patient');
      }
    }
  }, [user, router]);

  // Ensure user exists before rendering dashboard
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-spinner"></div>
        <p className="ml-2">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Dashboard | Healthcare Management System</title>
      </Head>

      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Welcome to the Healthcare Management System
          </h1>
          <p className="mb-6 text-gray-600">
            Redirecting you to the appropriate dashboard...
          </p>
          <div className="loading-spinner mx-auto"></div>
          <div className="mt-8 text-gray-500 text-sm">
      
            <p>Role: {user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
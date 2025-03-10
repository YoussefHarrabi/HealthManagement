import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  UsersIcon,
  ChartBarIcon,
  DocumentReportIcon,
  MenuIcon,
  XIcon,
  LogoutIcon
} from '@heroicons/react/outline';
import DoctorsList from '../../../components/department-head/DoctorsList';

type DoctorsListPageProps = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  logout: () => void;
};

export default function DoctorsListPage({ user, logout }: DoctorsListPageProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentDateTime = '2025-03-09 02:24:17';
  const currentUserLogin = 'Feriel Dh';

  // Check if user is department-head
  if (!user || user.role !== 'department-head') {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard/department-head', icon: ChartBarIcon, current: false },
    { name: 'Doctors List', href: '/dashboard/department-head/doctors', icon: UsersIcon, current: true },
    { name: 'Reports', href: '/dashboard/department-head/reports', icon: DocumentReportIcon, current: false },
    { name: 'Department Statistics', href: '/dashboard/department-head/statistics', icon: ChartBarIcon, current: false },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Head>
        <title>Doctors List | Healthcare Management System</title>
      </Head>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-blue-600">Department Head</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      item.current
                        ? 'text-blue-500'
                        : 'text-gray-400 group-hover:text-blue-500'
                    } mr-4 flex-shrink-0 h-6 w-6`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              className="flex-shrink-0 group block w-full"
              onClick={logout}
            >
              <div className="flex items-center">
                <div className="ml-3 w-full">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {user.name}
                    </p>
                    <LogoutIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  </div>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    Logout
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-blue-600">Department Head</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        item.current
                          ? 'text-blue-500'
                          : 'text-gray-400 group-hover:text-blue-500'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                className="flex-shrink-0 w-full group flex"
                onClick={logout}
              >
                <div className="flex items-center w-full">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {user.name}
                      </p>
                      <LogoutIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    </div>
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                      Logout
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="pb-5 border-b border-gray-200 mb-5 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Doctors Management</h1>
                <div className="text-sm text-gray-500">
                  <p>2025-03-09 02:25:55 UTC</p>
                  <p>User: Feriel Dh</p>
                </div>
              </div>
              
              <DoctorsList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
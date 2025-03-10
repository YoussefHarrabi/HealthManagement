import { JSX, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  ClipboardListIcon,
  DocumentReportIcon,
  CogIcon,
  LogoutIcon,
  ChartBarIcon,
  UserCircleIcon,
  PhotographIcon,
} from '@heroicons/react/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
  roles?: string[];
}

interface SidebarProps {
  userRole?: string;
}

export default function Sidebar({ userRole = 'admin' }: SidebarProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const currentDate = new Date('2025-03-08 23:50:44');
  const currentUser = 'YoussefHarrabi';
  
  // Base navigation items available to all users
  const baseNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  ];
  
  // Role-specific navigation items - updated paths to match actual routes
  const roleBasedNavigation: Record<string, NavigationItem[]> = {
    admin: [
      { name: 'User Management', href: '/dashboard/admin/users', icon: UsersIcon },
      { name: 'Department Management', href: '/dashboard/admin/departments', icon: CogIcon },
      { name: 'Statistics', href: '/dashboard/admin/statistics', icon: ChartBarIcon },
      { name: 'Reports', href: '/dashboard/admin/reports', icon: DocumentReportIcon },
      { name: 'Settings', href: '/dashboard/admin/settings', icon: CogIcon },
    ],
    doctor: [
      { name: 'My Patients', href: '/dashboard/doctor/patients', icon: UsersIcon },
      { name: 'Appointments', href: '/dashboard/doctor/appointments', icon: CalendarIcon },
      { name: 'Task Assignment', href: '/dashboard/doctor/task-assignment', icon: ClipboardListIcon },
      { name: 'Test Prescription', href: '/dashboard/doctor/test-prescription', icon: DocumentReportIcon },
      { name: 'Reports', href: '/dashboard/doctor/reports', icon: DocumentReportIcon },
    ],
    patient: [
      { name: 'My Profile', href: '/dashboard/patient/profile', icon: UserCircleIcon },
      { name: 'Medical History', href: '/dashboard/patient/medical-history', icon: DocumentReportIcon },
      { name: 'Appointments', href: '/dashboard/patient/appointments', icon: CalendarIcon },
    ],
    nurse: [
      { name: 'Task List', href: '/dashboard/nurse/tasks', icon: ClipboardListIcon },
      { name: 'Task Execution', href: '/dashboard/nurse/task-execution', icon: ClipboardListIcon },
      { name: 'Patients', href: '/dashboard/nurse/patients', icon: UsersIcon },
      { name: 'Reports', href: '/dashboard/nurse/reports', icon: DocumentReportIcon },
    ],
    radiologist: [
      { name: 'Upload Images', href: '/dashboard/radiologist/upload-images', icon: PhotographIcon },
      { name: 'Image Library', href: '/dashboard/radiologist/image-library', icon: PhotographIcon },
      { name: 'Reports', href: '/dashboard/radiologist/reports', icon: DocumentReportIcon },
    ],
  };
  
  // Get navigation items based on user role
  const navigationItems = [
    ...baseNavigation,
    ...(roleBasedNavigation[userRole] || [])
  ];

  return (
    <div className={`flex flex-col h-full border-r border-gray-200 ${collapsed ? 'w-16' : 'w-64'} bg-white`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className={`${collapsed ? 'hidden' : 'flex items-center'}`}>
          <div className="text-lg font-bold text-blue-600">HCMS</div>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:border-blue-500"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.name}>
                <Link href={item.href} legacyBehavior>
                  <a
                    className={`
                      ${isActive ? 'bg-blue-50 text-blue-600 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'}
                      group flex items-center px-3 py-2 text-sm font-medium border-l-4
                    `}
                  >
                    <item.icon
                      className={`
                        ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                        mr-3 flex-shrink-0 h-6 w-6
                      `}
                      aria-hidden="true"
                    />
                    {!collapsed && <span>{item.name}</span>}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {!collapsed && (
        <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
          <div>Logged in as: {currentUser}</div>
          <div>{currentDate.toLocaleString()}</div>
        </div>
      )}
      
      <div className="p-4 border-t border-gray-200">
        <Link href="/auth/login" legacyBehavior>
          <a className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
            <LogoutIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
            {!collapsed && <span>Logout</span>}
          </a>
        </Link>
      </div>
    </div>
  );
}
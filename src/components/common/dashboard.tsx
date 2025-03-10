import React, { JSX } from 'react';
import Card from './Card';
import { ChartBarIcon, CalendarIcon, UserIcon, ClipboardIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';

interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
  color: string;
}

interface dashboardProps {
  userRole?: string;
}

export default function dashboard({ userRole = 'admin' }: dashboardProps) {
  const router = useRouter();
  const currentDate = new Date('2025-03-08 15:23:41').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Different stats based on user role
  const roleStats: Record<string, StatCard[]> = {
    admin: [
      {
        title: 'Total Users',
        value: 345,
        description: '+5.2% from last month',
        icon: UserIcon,
        color: 'bg-pink-500'
      },
      {
        title: 'Appointments Today',
        value: 48,
        description: '12 requiring attention',
        icon: CalendarIcon,
        color: 'bg-blue-500'
      },
      {
        title: 'Active Patients',
        value: 215,
        description: '23 new this week',
        icon: UserIcon,
        color: 'bg-green-500'
      },
      {
        title: 'Department Efficiency',
        value: '87%',
        description: '+2.3% from last week',
        icon: ChartBarIcon,
        color: 'bg-purple-500'
      }
    ],
    doctor: [
      {
        title: 'My Patients',
        value: 24,
        description: '3 new this week',
        icon: UserIcon,
        color: 'bg-blue-500'
      },
      {
        title: 'Appointments Today',
        value: 8,
        description: 'Next: 10:30 AM',
        icon: CalendarIcon,
        color: 'bg-green-500'
      },
      {
        title: 'Tasks',
        value: 12,
        description: '5 pending review',
        icon: ClipboardIcon,
        color: 'bg-yellow-500'
      },
      {
        title: 'Reports Due',
        value: 3,
        description: 'Due within 48 hours',
        icon: ChartBarIcon,
        color: 'bg-red-500'
      }
    ],
    patient: [
      {
        title: 'Upcoming Appointments',
        value: 2,
        description: 'Next: Mar 15, 2025',
        icon: CalendarIcon,
        color: 'bg-blue-500'
      },
      {
        title: 'Prescriptions',
        value: 3,
        description: '1 needs renewal',
        icon: ClipboardIcon,
        color: 'bg-green-500'
      },
      {
        title: 'Medical Records',
        value: 8,
        description: 'Last updated: Mar 5, 2025',
        icon: ChartBarIcon,
        color: 'bg-purple-500'
      },
      {
        title: 'Messages',
        value: 1,
        description: 'From Dr. Smith',
        icon: UserIcon,
        color: 'bg-yellow-500'
      }
    ],
    nurse: [
      {
        title: 'Assigned Patients',
        value: 12,
        description: '4 requiring care now',
        icon: UserIcon,
        color: 'bg-green-500'
      },
      {
        title: 'Tasks Today',
        value: 18,
        description: '6 completed, 12 pending',
        icon: ClipboardIcon,
        color: 'bg-blue-500'
      },
      {
        title: 'Medication Schedule',
        value: 8,
        description: 'Next due: 16:00',
        icon: CalendarIcon,
        color: 'bg-purple-500'
      },
      {
        title: 'Critical Alerts',
        value: 2,
        description: 'Requires immediate attention',
        icon: ChartBarIcon,
        color: 'bg-red-500'
      }
    ],
    radiologist: [
      {
        title: 'Pending Scans',
        value: 14,
        description: '3 high priority',
        icon: ClipboardIcon,
        color: 'bg-blue-500'
      },
      {
        title: 'Reports Due',
        value: 7,
        description: '2 urgent',
        icon: ChartBarIcon,
        color: 'bg-yellow-500'
      },
      {
        title: 'Today\'s Uploads',
        value: 8,
        description: '+3 from yesterday',
        icon: UserIcon,
        color: 'bg-green-500'
      },
      {
        title: 'Equipment Status',
        value: '100%',
        description: 'All systems operational',
        icon: CalendarIcon,
        color: 'bg-purple-500'
      }
    ]
  };

  // Get stats for the current role
  const stats = roleStats[userRole] || roleStats.admin;

  // Recent activity data
  const recentActivity = [
    {
      id: 1,
      type: 'appointment',
      description: 'New appointment scheduled with Dr. Johnson',
      time: '2025-03-08 14:45:22',
      status: 'success'
    },
    {
      id: 2,
      type: 'patient',
      description: 'Patient Maria Garcia updated contact information',
      time: '2025-03-08 12:32:15',
      status: 'info'
    },
    {
      id: 3,
      type: 'task',
      description: 'Task "Blood pressure check" marked as completed',
      time: '2025-03-08 10:15:40',
      status: 'success'
    },
    {
      id: 4,
      type: 'alert',
      description: 'System maintenance scheduled for Mar 10, 2025',
      time: '2025-03-08 09:20:18',
      status: 'warning'
    },
    {
      id: 5,
      type: 'report',
      description: 'Monthly departmental report is ready for review',
      time: '2025-03-07 16:05:33',
      status: 'info'
    }
  ];

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: string): string => {
    const now = new Date('2025-03-08 15:34:10');
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Status badge styles
  const statusStyles = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Welcome, YoussefHarrabi</h2>
        <p className="text-sm text-gray-500">{currentDate}</p>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <div className={`${stat.color} rounded-full p-2`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{stat.title}</h3>
              <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Recent Activity">
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatRelativeTime(activity.time)}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[activity.status as keyof typeof statusStyles]}`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
        
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push(`/dashboard/${userRole}/appointments`)}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm px-4 py-4 text-center"
            >
              <CalendarIcon className="mx-auto h-7 w-7 text-primary-500" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Appointments
              </span>
            </button>
            
            <button
              onClick={() => router.push(`/dashboard/${userRole}/messages`)}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm px-4 py-4 text-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-7 w-7 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Messages
              </span>
            </button>
            
            <button
              onClick={() => router.push(`/dashboard/${userRole}/${userRole === 'patient' ? 'medical-history' : 'reports'}`)}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm px-4 py-4 text-center"
            >
              <ChartBarIcon className="mx-auto h-7 w-7 text-primary-500" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {userRole === 'patient' ? 'Medical History' : 'Reports'}
              </span>
            </button>
            
            <button
              onClick={() => router.push(`/dashboard/${userRole}/profile`)}
              className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm px-4 py-4 text-center"
            >
              <UserIcon className="mx-auto h-7 w-7 text-primary-500" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Profile
              </span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
import { JSX, useState } from 'react';
import Card from '../common/Card';
import { 
  ChartBarIcon, 
  UserIcon, 
  CalendarIcon, 
  ClockIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/solid';

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
}

interface DepartmentData {
  id: number;
  name: string;
  color: string;
  patients: number;
  staff: number;
  utilization: number;
  averageWaitTime: number;
}

interface MonthlyData {
  month: string;
  patients: number;
  appointments: number;
  revenue: number;
}

export default function StatisticsDashboard() {
  const [timeRange, setTimeRange] = useState<string>('month');
  const currentDate = new Date('2025-03-08 15:38:56').toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  
  const stats: StatCard[] = [
    {
      title: 'Total Patients',
      value: '2,345',
      change: '+5.4%',
      changeType: 'positive',
      icon: UserIcon
    },
    {
      title: 'Appointments',
      value: '856',
      change: '+2.1%',
      changeType: 'positive',
      icon: CalendarIcon
    },
    {
      title: 'Avg. Wait Time',
      value: '18 min',
      change: '-3.2%',
      changeType: 'positive',
      icon: ClockIcon
    },
    {
      title: 'Revenue',
      value: '$234,567',
      change: '+8.1%',
      changeType: 'positive',
      icon: CurrencyDollarIcon
    }
  ];
  
  const departmentData: DepartmentData[] = [
    { id: 1, name: 'Emergency', color: 'bg-red-500', patients: 234, staff: 45, utilization: 78, averageWaitTime: 32 },
    { id: 2, name: 'Cardiology', color: 'bg-blue-500', patients: 189, staff: 28, utilization: 65, averageWaitTime: 45 },
    { id: 3, name: 'Neurology', color: 'bg-purple-500', patients: 145, staff: 18, utilization: 72, averageWaitTime: 38 },
    { id: 4, name: 'Oncology', color: 'bg-yellow-500', patients: 122, staff: 24, utilization: 58, averageWaitTime: 42 },
    { id: 5, name: 'Pediatrics', color: 'bg-green-500', patients: 298, staff: 36, utilization: 82, averageWaitTime: 25 },
    { id: 6, name: 'Radiology', color: 'bg-indigo-500', patients: 187, staff: 22, utilization: 70, averageWaitTime: 28 },
  ];
  
  const monthlyData: MonthlyData[] = [
    { month: 'Jan', patients: 1850, appointments: 720, revenue: 195000 },
    { month: 'Feb', patients: 1920, appointments: 750, revenue: 203000 },
    { month: 'Mar', patients: 2100, appointments: 810, revenue: 220000 },
    { month: 'Apr', patients: 2080, appointments: 790, revenue: 218000 },
    { month: 'May', patients: 2210, appointments: 830, revenue: 232000 },
    { month: 'Jun', patients: 2150, appointments: 805, revenue: 225000 },
    { month: 'Jul', patients: 2180, appointments: 820, revenue: 229000 },
    { month: 'Aug', patients: 2240, appointments: 840, revenue: 235000 },
    { month: 'Sep', patients: 2270, appointments: 860, revenue: 238000 },
    { month: 'Oct', patients: 2320, appointments: 875, revenue: 242000 },
    { month: 'Nov', patients: 2290, appointments: 865, revenue: 240000 },
    { month: 'Dec', patients: 2345, appointments: 856, revenue: 248000 }
  ];

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Statistics & Analytics</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Data for:</span>
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="input-field text-sm"
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="quarter">Past Quarter</option>
            <option value="year">Past Year</option>
          </select>
        </div>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 truncate">{stat.title}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={`rounded-full p-3 ${stat.changeType === 'positive' ? 'bg-green-50' : stat.changeType === 'negative' ? 'bg-red-50' : 'bg-gray-50'}`}>
                <stat.icon className={`h-6 w-6 ${stat.changeType === 'positive' ? 'text-green-500' : stat.changeType === 'negative' ? 'text-red-500' : 'text-gray-500'}`} />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
                {stat.change} {timeRange === 'week' ? 'this week' : timeRange === 'month' ? 'this month' : timeRange === 'quarter' ? 'this quarter' : 'this year'}
              </span>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Activity">
          <div className="h-64">
            {/* This would typically be a chart component */}
            <div className="h-full flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Monthly activity chart would appear here</p>
                <p className="text-xs text-gray-400 mt-1">Data for {currentDate}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-5 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <span className="block text-sm font-medium text-blue-800">Patients</span>
              <span className="block text-xl font-semibold text-blue-900 mt-1">2,345</span>
              <span className="text-xs text-blue-700">+5.4% from last month</span>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <span className="block text-sm font-medium text-green-800">Appointments</span>
              <span className="block text-xl font-semibold text-green-900 mt-1">856</span>
              <span className="text-xs text-green-700">+2.1% from last month</span>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <span className="block text-sm font-medium text-purple-800">Revenue</span>
              <span className="block text-xl font-semibold text-purple-900 mt-1">$248K</span>
              <span className="text-xs text-purple-700">+8.1% from last month</span>
            </div>
          </div>
        </Card>
        
        <Card title="Department Overview">
          <div className="space-y-3">
            {departmentData.map((dept) => (
              <div key={dept.id} className="flex items-center">
                <div className={`${dept.color} h-4 w-4 rounded-full mr-3`}></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{dept.name}</span>
                    <span className="text-sm text-gray-500">{dept.utilization}% utilization</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className={`${dept.color} h-2 rounded-full`} style={{ width: `${dept.utilization}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Department Metrics</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Wait (min)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {departmentData.map((dept) => (
                    <tr key={dept.id}>
                      <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">{dept.patients}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">{dept.staff}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">{dept.averageWaitTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Additional Analytics */}
      <Card title="Yearly Revenue & Patient Trends">
        <div className="h-80">
          {/* This would typically be a chart component */}
          <div className="h-full flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Yearly trend chart would appear here</p>
              <p className="text-xs text-gray-400 mt-1">Data as of {new Date('2025-03-08 15:40:55').toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Monthly Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointments</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyData.map((data, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{data.month}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{data.patients.toLocaleString()}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{data.appointments.toLocaleString()}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${data.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
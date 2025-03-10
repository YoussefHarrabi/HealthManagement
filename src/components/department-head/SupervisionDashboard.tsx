import React, { useState, useEffect } from 'react';
import { ChartBarIcon, UserGroupIcon, CalendarIcon, ClockIcon } from '@heroicons/react/outline';

interface DepartmentMetrics {
  totalDoctors: number;
  totalPatients: number;
  appointmentsToday: number;
  averageWaitTime: string;
  patientSatisfaction: number;
}

interface DoctorPerformance {
  id: number;
  name: string;
  patients: number;
  appointmentsCompleted: number;
  avgConsultationTime: string;
  patientRating: number;
}

const SupervisionDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DepartmentMetrics | null>(null);
  const [performances, setPerformances] = useState<DoctorPerformance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const mockMetrics: Record<string, DepartmentMetrics> = {
    daily: {
      totalDoctors: 8,
      totalPatients: 45,
      appointmentsToday: 38,
      averageWaitTime: '12 mins',
      patientSatisfaction: 4.6
    },
    weekly: {
      totalDoctors: 8,
      totalPatients: 215,
      appointmentsToday: 196,
      averageWaitTime: '14 mins',
      patientSatisfaction: 4.5
    },
    monthly: {
      totalDoctors: 10,
      totalPatients: 842,
      appointmentsToday: 763,
      averageWaitTime: '15 mins',
      patientSatisfaction: 4.4
    }
  };

  const mockPerformances: DoctorPerformance[] = [
    { id: 1, name: 'Dr. Sarah Chen', patients: 42, appointmentsCompleted: 38, avgConsultationTime: '18 mins', patientRating: 4.8 },
    { id: 2, name: 'Dr. Michael Rodriguez', patients: 38, appointmentsCompleted: 35, avgConsultationTime: '22 mins', patientRating: 4.7 },
    { id: 3, name: 'Dr. Emma Wilson', patients: 56, appointmentsCompleted: 50, avgConsultationTime: '15 mins', patientRating: 4.9 },
    { id: 4, name: 'Dr. James Taylor', patients: 31, appointmentsCompleted: 28, avgConsultationTime: '20 mins', patientRating: 4.6 }
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API fetch
    setTimeout(() => {
      setMetrics(mockMetrics[timeframe]);
      setPerformances(mockPerformances);
      setLoading(false);
    }, 800);
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe: 'daily' | 'weekly' | 'monthly') => {
    setTimeframe(newTimeframe);
  };

  if (loading || !metrics) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeframe selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4">
          <button 
            onClick={() => handleTimeframeChange('daily')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${timeframe === 'daily' 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
          >
            Daily
          </button>
          <button 
            onClick={() => handleTimeframeChange('weekly')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${timeframe === 'weekly' 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => handleTimeframeChange('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${timeframe === 'monthly' 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Department metrics */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Department Performance ({timeframe})</h2>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Doctors</p>
                  <h4 className="text-xl font-bold">{metrics.totalDoctors}</h4>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-md">
                  <UserGroupIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Patients</p>
                  <h4 className="text-xl font-bold">{metrics.totalPatients}</h4>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-md">
                  <CalendarIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Appointments</p>
                  <h4 className="text-xl font-bold">{metrics.appointmentsToday}</h4>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-md">
                  <ClockIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Avg Wait Time</p>
                  <h4 className="text-xl font-bold">{metrics.averageWaitTime}</h4>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-medium">Patient Satisfaction</h3>
              <span className="text-sm text-gray-500">{metrics.patientSatisfaction} / 5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(metrics.patientSatisfaction / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor performance table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Doctor Performance</h2>
            </div>
            <button className="btn-secondary btn-sm">
              Download Report
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patients
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appts. Completed
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Consultation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performances.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{doctor.patients}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{doctor.appointmentsCompleted}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{doctor.avgConsultationTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{doctor.patientRating}</span>
                      <span className="ml-1 text-yellow-500">★</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupervisionDashboard;
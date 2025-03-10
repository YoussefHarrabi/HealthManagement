import React, { useState, useEffect } from 'react';
import { 
  DocumentReportIcon, 
  DownloadIcon, 
  ChartPieIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  FilterIcon,
  ClipboardCheckIcon 
} from '@heroicons/react/outline';

interface Report {
  id: number;
  name: string;
  type: 'Performance' | 'Financial' | 'Operational' | 'Clinical';
  date: string;
  size: string;
  status: 'New' | 'Generated' | 'Archived';
}

const DepartmentReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('All');

  // Mock data
  const mockReports: Report[] = [
    { id: 1, name: 'Department Performance Q1 2025', type: 'Performance', date: '2025-03-01', size: '1.2 MB', status: 'New' },
    { id: 2, name: 'Budget Analysis Report', type: 'Financial', date: '2025-02-15', size: '2.8 MB', status: 'Generated' },
    { id: 3, name: 'Staff Efficiency Metrics', type: 'Operational', date: '2025-02-10', size: '3.4 MB', status: 'Generated' },
    { id: 4, name: 'Patient Outcomes Summary', type: 'Clinical', date: '2025-02-01', size: '5.1 MB', status: 'Archived' },
    { id: 5, name: 'Department Performance Q4 2024', type: 'Performance', date: '2025-01-05', size: '1.4 MB', status: 'Archived' },
    { id: 6, name: 'Equipment Utilization Report', type: 'Operational', date: '2025-01-01', size: '0.9 MB', status: 'Archived' },
    { id: 7, name: 'Treatment Success Rates', type: 'Clinical', date: '2024-12-15', size: '2.2 MB', status: 'Archived' },
    { id: 8, name: 'Annual Department Review', type: 'Performance', date: '2024-12-10', size: '4.5 MB', status: 'Archived' },
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API fetch
    setTimeout(() => {
      if (filter === 'All') {
        setReports(mockReports);
      } else {
        setReports(mockReports.filter(report => report.type === filter));
      }
      setLoading(false);
    }, 800);
  }, [filter]);

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'Performance':
        return <ChartBarIcon className="h-5 w-5 text-blue-500" />;
      case 'Financial':
        return <ChartPieIcon className="h-5 w-5 text-green-500" />;
      case 'Operational':
        return <CalendarIcon className="h-5 w-5 text-yellow-500" />;
      case 'Clinical':
        return <ClipboardCheckIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DocumentReportIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Generated':
        return 'bg-green-100 text-green-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <DocumentReportIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Department Reports</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FilterIcon className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="input-field pl-10"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Performance">Performance</option>
                <option value="Financial">Financial</option>
                <option value="Operational">Operational</option>
                <option value="Clinical">Clinical</option>
              </select>
            </div>
            
            <button className="btn-primary btn-md">
              Generate New Report
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="py-8 text-center">
            <div className="loading-spinner mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-8 text-center">
            <DocumentReportIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-base font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no reports matching your filter criteria.
            </p>
            <div className="mt-6">
              <button 
                onClick={() => setFilter('All')}
                className="btn-secondary btn-md"
              >
                Clear Filter
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getReportIcon(report.type)}
                        <div className="ml-4 text-sm font-medium text-gray-900">{report.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{report.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(report.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{report.size}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="btn-secondary btn-sm mr-2">View</button>
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentReports;
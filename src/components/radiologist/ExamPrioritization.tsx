import React, { useState, useEffect } from 'react';
import { 
  ClipboardListIcon, 
  SortAscendingIcon, 
  FilterIcon, 
  ExclamationIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/outline';

interface ExamItem {
  id: number;
  patientName: string;
  patientId: string;
  type: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  requestedDate: string;
  requestedBy: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  completedDate?: string;
  notes?: string;
}

const ExamPrioritization: React.FC = () => {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortKey, setSortKey] = useState<keyof ExamItem>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('Pending');
  const currentDate = new Date('2025-03-09T00:53:33Z');
  const currentUser = 'YoussefHarrabi';

  // Mock data
  const mockExams: ExamItem[] = [
    {
      id: 1,
      patientName: 'John Smith',
      patientId: 'P10045',
      type: 'CT Scan - Brain',
      priority: 'Urgent',
      requestedDate: '2025-03-08T22:15:00Z',
      requestedBy: 'Dr. Sarah Chen',
      status: 'Pending',
      notes: 'Patient showing signs of increased intracranial pressure'
    },
    {
      id: 2,
      patientName: 'Maria Garcia',
      patientId: 'P10078',
      type: 'MRI - Lumbar Spine',
      priority: 'High',
      requestedDate: '2025-03-08T18:30:00Z',
      requestedBy: 'Dr. James Taylor',
      status: 'Pending',
      notes: 'Suspected disc herniation with radiculopathy'
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      patientId: 'P10092',
      type: 'X-Ray - Chest',
      priority: 'Medium',
      requestedDate: '2025-03-08T16:45:00Z',
      requestedBy: 'Dr. Emma Wilson',
      status: 'In Progress'
    },
    {
      id: 4,
      patientName: 'Emily Brown',
      patientId: 'P10063',
      type: 'CT Scan - Abdomen',
      priority: 'High',
      requestedDate: '2025-03-08T14:20:00Z',
      requestedBy: 'Dr. Michael Rodriguez',
      status: 'Pending',
      notes: 'Acute abdominal pain, rule out appendicitis'
    },
    {
      id: 5,
      patientName: 'David Wilson',
      patientId: 'P10104',
      type: 'Ultrasound - Thyroid',
      priority: 'Low',
      requestedDate: '2025-03-08T11:10:00Z',
      requestedBy: 'Dr. Aisha Patel',
      status: 'Pending'
    },
    {
      id: 6,
      patientName: 'Jennifer Lee',
      patientId: 'P10056',
      type: 'MRI - Knee',
      priority: 'Medium',
      requestedDate: '2025-03-08T09:45:00Z',
      requestedBy: 'Dr. David Kim',
      status: 'Completed',
      completedDate: '2025-03-08T23:30:00Z'
    },
    {
      id: 7,
      patientName: 'Michael Thompson',
      patientId: 'P10087',
      type: 'CT Scan - Chest',
      priority: 'Urgent',
      requestedDate: '2025-03-08T08:15:00Z',
      requestedBy: 'Dr. Sarah Chen',
      status: 'Completed',
      completedDate: '2025-03-08T10:20:00Z'
    },
    {
      id: 8,
      patientName: 'Anna Rodriguez',
      patientId: 'P10072',
      type: 'X-Ray - Hand',
      priority: 'Low',
      requestedDate: '2025-03-07T16:00:00Z',
      requestedBy: 'Dr. James Taylor',
      status: 'Cancelled'
    }
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API fetch
    setTimeout(() => {
      let filteredExams = mockExams;
      if (statusFilter !== 'All') {
        filteredExams = mockExams.filter(exam => exam.status === statusFilter);
      }
      
      setExams(filteredExams);
      setLoading(false);
    }, 800);
  }, [statusFilter]);

  const handleSort = (key: keyof ExamItem) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((currentDate.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 3600;
    if (interval > 24) {
      return Math.floor(interval / 24) + ' days ago';
    }
    if (interval > 1) {
      return Math.floor(interval) + ' hours ago';
    }
    
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes ago';
    }
    
    return Math.floor(seconds) + ' seconds ago';
  };

  // Sort exams based on current sort key and direction
  const sortedExams = [...exams].sort((a, b) => {
    if (sortKey === 'priority') {
      // Custom sort order for priority
      const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
      const aValue = priorityOrder[a[sortKey] as 'Urgent' | 'High' | 'Medium' | 'Low'];
      const bValue = priorityOrder[b[sortKey] as 'Urgent' | 'High' | 'Medium' | 'Low'];
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (sortKey === 'requestedDate') {
      // Date comparison
      const aDate = new Date(a[sortKey]).getTime();
      const bDate = new Date(b[sortKey]).getTime();
      return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
    } else {
      // String comparison
      const aValue = a[sortKey]?.toString().toLowerCase() || '';
      const bValue = b[sortKey]?.toString().toLowerCase() || '';
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
  });

  const updateExamStatus = (id: number, status: ExamItem['status']) => {
    setExams(prev => prev.map(exam => {
      if (exam.id === id) {
        return {
          ...exam,
          status,
          completedDate: status === 'Completed' ? new Date().toISOString() : exam.completedDate
        };
      }
      return exam;
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <ClipboardListIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Exam Prioritization</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FilterIcon className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="input-field pl-10"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="py-8 text-center">
            <div className="loading-spinner mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading exams...</p>
          </div>
        ) : sortedExams.length === 0 ? (
          <div className="py-8 text-center">
            <ClipboardListIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-base font-medium text-gray-900">No exams found</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no exams matching your filter criteria.
            </p>
            <div className="mt-6">
              <button 
                onClick={() => setStatusFilter('All')}
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
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center">
                      Priority
                      {sortKey === 'priority' && (
                        <SortAscendingIcon className={`h-4 w-4 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('patientName')}
                  >
                    <div className="flex items-center">
                      Patient
                      {sortKey === 'patientName' && (
                        <SortAscendingIcon className={`h-4 w-4 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      Exam Type
                      {sortKey === 'type' && (
                        <SortAscendingIcon className={`h-4 w-4 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('requestedDate')}
                  >
                    <div className="flex items-center">
                      Requested
                      {sortKey === 'requestedDate' && (
                        <SortAscendingIcon className={`h-4 w-4 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortKey === 'status' && (
                        <SortAscendingIcon className={`h-4 w-4 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(exam.priority)}`}>
                        {exam.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{exam.patientName}</div>
                      <div className="text-xs text-gray-500">ID: {exam.patientId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exam.type}</div>
                      <div className="text-xs text-gray-500">Requested by: {exam.requestedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDateTime(exam.requestedDate)}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {getTimeAgo(exam.requestedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(exam.status)}`}>
                        {exam.status}
                      </span>
                      {exam.completedDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Completed: {formatDateTime(exam.completedDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {exam.status === 'Pending' && (
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => updateExamStatus(exam.id, 'In Progress')}
                            className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none"
                          >
                            Start Exam
                          </button>
                          <button 
                            onClick={() => updateExamStatus(exam.id, 'Cancelled')}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        </div>
                      )}
                      
                      {exam.status === 'In Progress' && (
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => updateExamStatus(exam.id, 'Completed')}
                            className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Complete
                          </button>
                          <button 
                            onClick={() => updateExamStatus(exam.id, 'Pending')}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Return to Queue
                          </button>
                        </div>
                      )}
                      
                      {(exam.status === 'Completed' || exam.status === 'Cancelled') && (
                        <button 
                          className="btn-secondary btn-sm"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Footer with information */}
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
            <div className="mb-2 sm:mb-0">
              <span>Current user: {currentUser}</span>
            </div>
            <div>
              <span>Last updated: {currentDate.toLocaleString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}</span>
            </div>
          </div>
        </div>
        
        {/* Notes for urgent cases */}
        {sortedExams.some(exam => exam.priority === 'Urgent' && exam.status === 'Pending') && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Urgent exams require immediate attention</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    There are {sortedExams.filter(exam => exam.priority === 'Urgent' && exam.status === 'Pending').length} urgent 
                    exams in the queue. Please prioritize these cases for immediate processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPrioritization;
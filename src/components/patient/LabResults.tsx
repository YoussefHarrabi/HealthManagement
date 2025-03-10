import { useState, useEffect, JSX } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { 
  DocumentTextIcon,
  DocumentDownloadIcon,
  ChartBarIcon,
  EyeIcon, 
  FilterIcon,
  CloudDownloadIcon
} from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';

interface LabTest {
  id: string;
  name: string;
  date: string;
  category: string;
  requestedBy: string;
  status: 'completed' | 'pending' | 'canceled';
  results?: {
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    flag?: 'normal' | 'low' | 'high' | 'critical';
  }[];
  notes?: string;
  documents?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

export default function LabResults() {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedTests, setExpandedTests] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  const currentDate = new Date('2025-03-08 16:09:49');

  // Mock data fetching
  useEffect(() => {
    // In a real app, this would be an API call
    const mockLabTests: LabTest[] = [
      {
        id: 'LAB-5432',
        name: 'Complete Blood Count (CBC)',
        date: '2025-02-15T11:30:00',
        category: 'Hematology',
        requestedBy: 'Dr. Emily Johnson',
        status: 'completed',
        results: [
          {
            parameter: 'WBC',
            value: '6.8',
            unit: '× 10^9/L',
            referenceRange: '4.5-11.0',
            flag: 'normal'
          },
          {
            parameter: 'RBC',
            value: '4.8',
            unit: '× 10^12/L',
            referenceRange: '4.5-5.5',
            flag: 'normal'
          },
          {
            parameter: 'Hemoglobin',
            value: '14.2',
            unit: 'g/dL',
            referenceRange: '13.5-17.5',
            flag: 'normal'
          },
          {
            parameter: 'Hematocrit',
            value: '42',
            unit: '%',
            referenceRange: '41-50',
            flag: 'normal'
          },
          {
            parameter: 'Platelets',
            value: '210',
            unit: '× 10^9/L',
            referenceRange: '150-450',
            flag: 'normal'
          }
        ],
        documents: [
          {
            id: 'DOC-CBC-001',
            name: 'CBC Test Results',
            type: 'pdf',
            url: '/documents/cbc-results.pdf'
          }
        ]
      },
      {
        id: 'LAB-5433',
        name: 'Lipid Panel',
        date: '2025-02-15T12:00:00',
        category: 'Clinical Chemistry',
        requestedBy: 'Dr. Emily Johnson',
        status: 'completed',
        results: [
          {
            parameter: 'Total Cholesterol',
            value: '215',
            unit: 'mg/dL',
            referenceRange: '<200',
            flag: 'high'
          },
          {
            parameter: 'HDL',
            value: '42',
            unit: 'mg/dL',
            referenceRange: '>40',
            flag: 'normal'
          },
          {
            parameter: 'LDL',
            value: '145',
            unit: 'mg/dL',
            referenceRange: '<100',
            flag: 'high'
          },
          {
            parameter: 'Triglycerides',
            value: '150',
            unit: 'mg/dL',
            referenceRange: '<150',
            flag: 'normal'
          }
        ],
        notes: 'Elevated cholesterol levels. Recommend dietary changes and possible medication.',
        documents: [
          {
            id: 'DOC-LIPID-001',
            name: 'Lipid Panel Results',
            type: 'pdf',
            url: '/documents/lipid-results.pdf'
          }
        ]
      },
      {
        id: 'LAB-5501',
        name: 'Comprehensive Metabolic Panel',
        date: '2025-02-15T12:30:00',
        category: 'Clinical Chemistry',
        requestedBy: 'Dr. Emily Johnson',
        status: 'completed',
        results: [
          {
            parameter: 'Glucose',
            value: '98',
            unit: 'mg/dL',
            referenceRange: '70-99',
            flag: 'normal'
          },
          {
            parameter: 'BUN',
            value: '15',
            unit: 'mg/dL',
            referenceRange: '7-20',
            flag: 'normal'
          },
          {
            parameter: 'Creatinine',
            value: '0.9',
            unit: 'mg/dL',
            referenceRange: '0.6-1.2',
            flag: 'normal'
          },
          {
            parameter: 'Sodium',
            value: '140',
            unit: 'mmol/L',
            referenceRange: '135-145',
            flag: 'normal'
          },
          {
            parameter: 'Potassium',
            value: '3.9',
            unit: 'mmol/L',
            referenceRange: '3.5-5.0',
            flag: 'normal'
          }
        ],
        documents: [
          {
            id: 'DOC-COMP-001',
            name: 'Metabolic Panel Results',
            type: 'pdf',
            url: '/documents/metabolic-results.pdf'
          }
        ]
      },
      {
        id: 'LAB-6023',
        name: 'HbA1c Test',
        date: '2025-02-15T13:00:00',
        category: 'Endocrinology',
        requestedBy: 'Dr. Emily Johnson',
        status: 'completed',
        results: [
          {
            parameter: 'HbA1c',
            value: '5.7',
            unit: '%',
            referenceRange: '<5.7',
            flag: 'high'
          }
        ],
        notes: 'Result indicates prediabetes. Recommend lifestyle modifications and follow-up in 3 months.',
        documents: [
          {
            id: 'DOC-A1C-001',
            name: 'HbA1c Test Results',
            type: 'pdf',
            url: '/documents/a1c-results.pdf'
          }
        ]
      },
      {
        id: 'LAB-7890',
        name: 'Urinalysis',
        date: '2024-12-10T09:45:00',
        category: 'Microbiology',
        requestedBy: 'Dr. Michael Rodriguez',
        status: 'completed',
        results: [
          {
            parameter: 'Color',
            value: 'Yellow',
            unit: '',
            referenceRange: 'Yellow',
            flag: 'normal'
          },
          {
            parameter: 'Clarity',
            value: 'Clear',
            unit: '',
            referenceRange: 'Clear',
            flag: 'normal'
          },
          {
            parameter: 'pH',
            value: '6.5',
            unit: '',
            referenceRange: '5.0-8.0',
            flag: 'normal'
          },
          {
            parameter: 'Protein',
            value: 'Negative',
            unit: '',
            referenceRange: 'Negative',
            flag: 'normal'
          },
          {
            parameter: 'Glucose',
            value: 'Negative',
            unit: '',
            referenceRange: 'Negative',
            flag: 'normal'
          }
        ],
        documents: [
          {
            id: 'DOC-URI-001',
            name: 'Urinalysis Results',
            type: 'pdf',
            url: '/documents/urinalysis-results.pdf'
          }
        ]
      },
      {
        id: 'LAB-8001',
        name: 'Liver Function Tests',
        date: '2025-03-15T10:00:00',
        category: 'Clinical Chemistry',
        requestedBy: 'Dr. Emily Johnson',
        status: 'pending'
      },
      {
        id: 'LAB-8002',
        name: 'Thyroid Panel',
        date: '2025-03-15T10:30:00',
        category: 'Endocrinology',
        requestedBy: 'Dr. Emily Johnson',
        status: 'pending'
      }
    ];
    
    // Sort lab tests by date (newest first)
    mockLabTests.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setLabTests(mockLabTests);
    setIsLoading(false);
  }, []);

  // Toggle expanded test
  const toggleTestExpansion = (testId: string) => {
    setExpandedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId) 
        : [...prev, testId]
    );
  };

   // Format date
   const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Get relative time
  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date('2025-03-08 16:14:26');
    
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  // Get status badge
  const getStatusBadge = (status: string): JSX.Element => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      canceled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Get flag indicator
  const getFlagIndicator = (flag?: string): JSX.Element => {
    if (!flag) return <></>;
    
    const flagClasses = {
      normal: 'bg-green-100 text-green-800',
      low: 'bg-blue-100 text-blue-800',
      high: 'bg-red-100 text-red-800',
      critical: 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${flagClasses[flag as keyof typeof flagClasses]}`}>
        {flag.charAt(0).toUpperCase() + flag.slice(1)}
      </span>
    );
  };

  // Filter tests
  const filteredTests = labTests
    .filter(test => filterStatus === 'all' || test.status === filterStatus)
    .filter(test => filterCategory === 'all' || test.category === filterCategory)
    .filter(test => {
      if (filterDate === 'all') return true;
      const testDate = new Date(test.date);
      const now = new Date('2025-03-08 16:14:26');
      
      if (filterDate === 'last7days') {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return testDate >= sevenDaysAgo;
      } else if (filterDate === 'last30days') {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return testDate >= thirtyDaysAgo;
      } else if (filterDate === 'last90days') {
        const ninetyDaysAgo = new Date(now);
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        return testDate >= ninetyDaysAgo;
      }
      return true;
    });

  // Get unique categories for filter
  const categories = Array.from(new Set(labTests.map(test => test.category)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Lab Results</h2>
      </div>

      <Card>
        <div className="pb-4 border-b mb-4">
          <div className="flex flex-wrap gap-3">
            <div>
              <label htmlFor="filterStatus" className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field text-sm py-1"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div>
              <label htmlFor="filterCategory" className="block text-xs font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-field text-sm py-1"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filterDate" className="block text-xs font-medium text-gray-700 mb-1">
                Time Period
              </label>
              <select
                id="filterDate"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="input-field text-sm py-1"
              >
                <option value="all">All Time</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading lab results...</div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-8">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No lab results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No lab results match your current filter criteria.
            </p>
            <div className="mt-6">
              <Button
                variant="white"
                size="sm"
                icon={<FilterIcon className="h-5 w-5" />}
                onClick={() => {
                  setFilterStatus('all');
                  setFilterCategory('all');
                  setFilterDate('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTests.map((test) => (
              <div 
                key={test.id} 
                className="border rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <div 
                  className="px-4 py-3 cursor-pointer flex justify-between items-center"
                  onClick={() => test.status === 'completed' && toggleTestExpansion(test.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">{test.name}</h3>
                      <div className="text-sm text-gray-500">
                        {test.category} • {test.requestedBy}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatDate(test.date)} ({getRelativeTime(test.date)})
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(test.status)}
                    {test.status === 'completed' && (
                      <ChevronDownIcon 
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          expandedTests.includes(test.id) ? 'transform rotate-180' : ''
                        }`} 
                      />
                    )}
                  </div>
                </div>

                {test.status === 'completed' && expandedTests.includes(test.id) && (
                  <div className="px-4 py-3 border-t">
                    {test.results && test.results.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Test Results</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Range</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {test.results.map((result, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{result.parameter}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{result.value}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{result.unit}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{result.referenceRange}</td>
                                  <td className="px-4 py-3 whitespace-nowrap">{getFlagIndicator(result.flag)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {test.notes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{test.notes}</p>
                      </div>
                    )}

                    {test.documents && test.documents.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Documents</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {test.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center p-3 border rounded-lg bg-gray-50">
                              <div className="flex-shrink-0">
                                {doc.type === 'pdf' ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                <p className="text-xs text-gray-500 uppercase">{doc.type}</p>
                              </div>
                              <div className="flex space-x-2">
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                >
                                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                </a>
                                <a
                                  href={doc.url}
                                  download
                                  className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                >
                                  <CloudDownloadIcon className="h-5 w-5" aria-hidden="true" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
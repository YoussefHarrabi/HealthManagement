import { useState, useEffect, JSX } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { DownloadIcon, EyeIcon } from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';

interface HistoryItem {
  id: string;
  type: 'visit' | 'test' | 'procedure' | 'prescription' | 'immunization';
  date: string;
  provider: string;
  department?: string;
  description: string;
  notes?: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  results?: {
    name: string;
    value: string;
    normalRange?: string;
    isNormal: boolean;
  }[];
}

export default function MedicalHistory() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const currentDate = new Date('2025-03-08 15:46:24');
  
  // Mock data fetching
  useEffect(() => {
    // In a real app, this would be an API call
    const mockHistoryItems: HistoryItem[] = [
      {
        id: 'V-10254',
        type: 'visit',
        date: '2025-02-15T10:30:00',
        provider: 'Dr. Emily Johnson',
        department: 'General Medicine',
        description: 'Annual physical examination',
        notes: 'Patient reports feeling well overall. Blood pressure slightly elevated. Recommended lifestyle modifications.',
        attachments: [
          {
            id: 'AT-001',
            name: 'Physical Exam Report',
            type: 'pdf',
            url: '/documents/exam-report.pdf'
          }
        ]
      },
      {
        id: 'T-20189',
        type: 'test',
        date: '2025-02-15T11:45:00',
        provider: 'Lab Services',
        department: 'Laboratory',
        description: 'Complete Blood Count (CBC)',
        results: [
          {
            name: 'WBC',
            value: '6.8 × 10^9/L',
            normalRange: '4.5-11.0 × 10^9/L',
            isNormal: true
          },
          {
            name: 'RBC',
            value: '4.8 × 10^12/L',
            normalRange: '4.5-5.5 × 10^12/L',
            isNormal: true
          },
          {
            name: 'Hemoglobin',
            value: '14.2 g/dL',
            normalRange: '13.5-17.5 g/dL',
            isNormal: true
          },
          {
            name: 'Hematocrit',
            value: '42%',
            normalRange: '41-50%',
            isNormal: true
          },
          {
            name: 'Platelets',
            value: '210 × 10^9/L',
            normalRange: '150-450 × 10^9/L',
            isNormal: true
          }
        ],
        attachments: [
          {
            id: 'AT-002',
            name: 'CBC Test Results',
            type: 'pdf',
            url: '/documents/cbc-results.pdf'
          }
        ]
      },
      {
        id: 'T-20190',
        type: 'test',
        date: '2025-02-15T12:15:00',
        provider: 'Lab Services',
        department: 'Laboratory',
        description: 'Lipid Panel',
        results: [
          {
            name: 'Total Cholesterol',
            value: '215 mg/dL',
            normalRange: '<200 mg/dL',
            isNormal: false
          },
          {
            name: 'HDL',
            value: '42 mg/dL',
            normalRange: '>40 mg/dL',
            isNormal: true
          },
          {
            name: 'LDL',
            value: '145 mg/dL',
            normalRange: '<100 mg/dL',
            isNormal: false
          },
          {
            name: 'Triglycerides',
            value: '150 mg/dL',
            normalRange: '<150 mg/dL',
            isNormal: true
          }
        ],
        attachments: [
          {
            id: 'AT-003',
            name: 'Lipid Panel Results',
            type: 'pdf',
            url: '/documents/lipid-results.pdf'
          }
        ]
      },
      {
        id: 'P-30078',
        type: 'prescription',
        date: '2025-02-15T13:00:00',
        provider: 'Dr. Emily Johnson',
        department: 'General Medicine',
        description: 'Atorvastatin 10mg',
        notes: 'Take one tablet daily in the evening. For cholesterol management.'
      },
      {
        id: 'P-30079',
        type: 'prescription',
        date: '2025-02-15T13:00:00',
        provider: 'Dr. Emily Johnson',
        department: 'General Medicine',
        description: 'Vitamin D3 2000 IU',
        notes: 'Take one tablet daily with food. For vitamin D deficiency.'
      },
      {
        id: 'V-10105',
        type: 'visit',
        date: '2024-12-03T09:15:00',
        provider: 'Dr. Michael Chen',
        department: 'Pulmonology',
        description: 'Asthma follow-up',
        notes: 'Asthma well-controlled. Continue current medication regimen. Follow up in 6 months.'
      },
      {
        id: 'PR-50023',
        type: 'procedure',
        date: '2024-09-18T08:30:00',
        provider: 'Dr. Sarah Williams',
        department: 'Radiology',
        description: 'Chest X-ray',
        notes: 'No acute findings. Lung fields clear.',
        attachments: [
          {
            id: 'AT-004',
            name: 'Chest X-ray Report',
            type: 'pdf',
            url: '/documents/xray-report.pdf'
          },
          {
            id: 'AT-005',
            name: 'Chest X-ray Image',
            type: 'image',
            url: '/images/xray-image.jpg'
          }
        ]
      },
      {
        id: 'I-40012',
        type: 'immunization',
        date: '2024-08-22T10:45:00',
        provider: 'Nurse Robert Jones',
        department: 'Primary Care',
        description: 'Influenza Vaccine',
        notes: 'Annual flu shot administered. No adverse reactions.'
      }
    ];
    
    // Sort by date descending
    mockHistoryItems.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setHistoryItems(mockHistoryItems);
    setIsLoading(false);
  }, []);

  // Toggle item expansion
  const toggleItem = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
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
    const diffInDays = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  // Filter items
  const filteredItems = selectedFilter === 'all' 
    ? historyItems 
    : historyItems.filter(item => item.type === selectedFilter);

  // Get type badge
  const getTypeBadge = (type: string): JSX.Element => {
    const badgeClasses = {
      visit: 'bg-blue-100 text-blue-800',
      test: 'bg-green-100 text-green-800',
      procedure: 'bg-purple-100 text-purple-800',
      prescription: 'bg-yellow-100 text-yellow-800',
      immunization: 'bg-indigo-100 text-indigo-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClasses[type as keyof typeof badgeClasses]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading medical history...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Medical History</h2>
        <div className="flex space-x-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="input-field text-sm"
          >
            <option value="all">All Types</option>
            <option value="visit">Visits</option>
            <option value="test">Tests</option>
            <option value="procedure">Procedures</option>
            <option value="prescription">Prescriptions</option>
            <option value="immunization">Immunizations</option>
          </select>
          <Button
                       variant="white"
                       icon={<DownloadIcon className="h-5 w-5" />}
                       size="sm"
                     >
                       Export History
                     </Button>
                   </div>
                 </div>
           
                 {filteredItems.length === 0 ? (
                   <Card>
                     <div className="text-center py-6">
                       <div className="text-gray-500">No medical history records found.</div>
                     </div>
                   </Card>
                 ) : (
                   <div className="space-y-4">
                     {filteredItems.map((item) => (
                       <Card key={item.id} className="overflow-hidden">
                         <div 
                           className="flex justify-between items-center cursor-pointer"
                           onClick={() => toggleItem(item.id)}
                         >
                           <div className="flex items-start space-x-3">
                             <div className="pt-1">{getTypeBadge(item.type)}</div>
                             <div>
                               <h3 className="text-base font-medium">{item.description}</h3>
                               <div className="text-sm text-gray-500 mt-1">
                                 {item.provider} {item.department ? `• ${item.department}` : ''}
                               </div>
                             </div>
                           </div>
                           <div className="flex items-center space-x-4">
                             <div className="text-right">
                               <div className="text-sm text-gray-900">{formatDate(item.date)}</div>
                               <div className="text-xs text-gray-500">{getRelativeTime(item.date)}</div>
                             </div>
                             <ChevronDownIcon 
                               className={`h-5 w-5 text-gray-400 transform transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`} 
                               aria-hidden="true" 
                             />
                           </div>
                         </div>
                         
                         {expandedItem === item.id && (
                           <div className="mt-4 pt-4 border-t">
                             {item.notes && (
                               <div className="mb-4">
                                 <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                                 <p className="text-sm text-gray-600">{item.notes}</p>
                               </div>
                             )}
                             
                             {item.results && item.results.length > 0 && (
                               <div className="mb-4">
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Results</h4>
                                 <div className="overflow-x-auto">
                                   <table className="min-w-full divide-y divide-gray-200">
                                     <thead className="bg-gray-50">
                                       <tr>
                                         <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                                         <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                                         <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Normal Range</th>
                                         <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                       </tr>
                                     </thead>
                                     <tbody className="bg-white divide-y divide-gray-200">
                                       {item.results.map((result, index) => (
                                         <tr key={index}>
                                           <td className="px-4 py-2 text-sm text-gray-900">{result.name}</td>
                                           <td className="px-4 py-2 text-sm text-gray-900">{result.value}</td>
                                           <td className="px-4 py-2 text-sm text-gray-500">{result.normalRange || 'N/A'}</td>
                                           <td className="px-4 py-2 text-sm">
                                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.isNormal ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                               {result.isNormal ? 'Normal' : 'Abnormal'}
                                             </span>
                                           </td>
                                         </tr>
                                       ))}
                                     </tbody>
                                   </table>
                                 </div>
                               </div>
                             )}
                             
                             {item.attachments && item.attachments.length > 0 && (
                               <div>
                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Documents</h4>
                                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                   {item.attachments.map((attachment) => (
                                     <div key={attachment.id} className="flex items-center p-3 border rounded-lg bg-gray-50">
                                       <div className="flex-shrink-0">
                                         {attachment.type === 'pdf' ? (
                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                             <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                           </svg>
                                         ) : attachment.type === 'image' ? (
                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                             <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                           </svg>
                                         ) : (
                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                             <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                           </svg>
                                         )}
                                       </div>
                                       <div className="ml-3 flex-1">
                                         <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                                         <p className="text-xs text-gray-500 uppercase">{attachment.type}</p>
                                       </div>
                                       <a 
                                         href={attachment.url}
                                         target="_blank"
                                         rel="noopener noreferrer"
                                         className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                       >
                                         <EyeIcon className="h-5 w-5" />
                                       </a>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                           </div>
                         )}
                       </Card>
                     ))}
                   </div>
                 )}
               </div>
             );
           }
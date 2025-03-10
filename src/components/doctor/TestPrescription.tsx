import { useState, useEffect, JSX } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { 
  SearchIcon, 
  DocumentAddIcon,
  FilterIcon
} from '@heroicons/react/outline';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  roomNumber?: string;
  status: string;
}

interface TestCategory {
  id: string;
  name: string;
  tests: Test[];
}

interface Test {
  id: string;
  name: string;
  description: string;
  preparation?: string;
  duration: string;
  categoryId: string;
}

interface TestOrder {
  id: string;
  patientId: string;
  patientName: string;
  testIds: string[];
  testNames: string[];
  status: 'Pending' | 'Scheduled' | 'Completed' | 'Canceled';
  priority: 'Routine' | 'Urgent' | 'STAT';
  orderedBy: string;
  orderedAt: string;
  notes?: string;
  scheduledDate?: string;
}

export default function TestPrescription() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [testCategories, setTestCategories] = useState<TestCategory[]>([]);
  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedTests, setSelectedTests] = useState<Test[]>([]);
  const [testPriority, setTestPriority] = useState<'Routine' | 'Urgent' | 'STAT'>('Routine');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const currentDate = new Date('2025-03-08 18:07:12');
  const currentUser = 'Dr. Feriel Dh';

  // Mock data fetching
  useEffect(() => {
    // In a real app, this would be an API call
    const mockPatients: Patient[] = [
      {
        id: 'P-10045',
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        roomNumber: '302A',
        status: 'Admitted'
      },
      {
        id: 'P-10047',
        name: 'Robert Williams',
        age: 67,
        gender: 'Male',
        roomNumber: '210B',
        status: 'Admitted'
      },
      {
        id: 'P-10048',
        name: 'Sarah Davis',
        age: 28,
        gender: 'Female',
        status: 'Emergency'
      },
      {
        id: 'P-10049',
        name: 'Michael Brown',
        age: 54,
        gender: 'Male',
        roomNumber: '405C',
        status: 'Admitted'
      }
    ];
    
    const mockTestCategories: TestCategory[] = [
        {
          id: 'CAT-001',
          name: 'Hematology',
          tests: [
            {
              id: 'TST-001',
              name: 'Complete Blood Count (CBC)',
              description: 'Measurement of red blood cells, white blood cells, and platelets',
              duration: '1-2 hours',
              categoryId: 'CAT-001'
            },
            {
              id: 'TST-002',
              name: 'Coagulation Panel',
              description: 'Assessment of blood clotting function',
              duration: '2-3 hours',
              categoryId: 'CAT-001'
            },
            {
              id: 'TST-003',
              name: 'Hemoglobin A1C',
              description: 'Measurement of average blood glucose over 2-3 months',
              preparation: 'No fasting required',
              duration: '1-2 days',
              categoryId: 'CAT-001'
            }
          ]
        },
        {
          id: 'CAT-002',
          name: 'Clinical Chemistry',
          tests: [
            {
              id: 'TST-004',
              name: 'Basic Metabolic Panel',
              description: 'Assessment of kidney function, blood glucose, and electrolyte levels',
              preparation: '8-12 hours fasting may be required',
              duration: '2-3 hours',
              categoryId: 'CAT-002'
            },
            {
              id: 'TST-005',
              name: 'Lipid Panel',
              description: 'Measurement of cholesterol levels',
              preparation: '9-12 hours fasting required',
              duration: '2-3 hours',
              categoryId: 'CAT-002'
            },
            {
              id: 'TST-006',
              name: 'Liver Function Tests',
              description: 'Assessment of liver function',
              duration: '2-3 hours',
              categoryId: 'CAT-002'
            }
          ]
        },
        {
          id: 'CAT-003',
          name: 'Imaging',
          tests: [
            {
              id: 'TST-007',
              name: 'Chest X-ray',
              description: 'Imaging of chest to assess heart and lung conditions',
              duration: '15-30 minutes',
              categoryId: 'CAT-003'
            },
            {
              id: 'TST-008',
              name: 'CT Scan - Abdomen',
              description: 'Detailed imaging of abdominal organs',
              preparation: 'May require contrast. No food 4 hours before.',
              duration: '30-60 minutes',
              categoryId: 'CAT-003'
            },
            {
              id: 'TST-009',
              name: 'MRI - Brain',
              description: 'Detailed imaging of brain structures',
              preparation: 'Remove all metal objects. May require sedation.',
              duration: '45-90 minutes',
              categoryId: 'CAT-003'
            }
          ]
        },
        {
          id: 'CAT-004',
          name: 'Cardiology',
          tests: [
            {
              id: 'TST-010',
              name: 'Electrocardiogram (ECG)',
              description: 'Recording of electrical activity of the heart',
              duration: '10-15 minutes',
              categoryId: 'CAT-004'
            },
            {
              id: 'TST-011',
              name: 'Echocardiogram',
              description: 'Ultrasound imaging of the heart',
              duration: '30-45 minutes',
              categoryId: 'CAT-004'
            },
            {
              id: 'TST-012',
              name: 'Stress Test',
              description: 'Assessment of heart function during exercise',
              preparation: 'Wear comfortable clothing. No food 3 hours before.',
              duration: '30-60 minutes',
              categoryId: 'CAT-004'
            }
          ]
        }
      ];
      
      const mockTestOrders: TestOrder[] = [
        {
          id: 'ORD-5001',
          patientId: 'P-10045',
          patientName: 'John Smith',
          testIds: ['TST-001', 'TST-004'],
          testNames: ['Complete Blood Count (CBC)', 'Basic Metabolic Panel'],
          status: 'Completed',
          priority: 'Routine',
          orderedBy: 'Dr. Feriel Dh',
          orderedAt: '2025-03-06T10:30:00',
          scheduledDate: '2025-03-07T09:00:00'
        },
        {
          id: 'ORD-5002',
          patientId: 'P-10047',
          patientName: 'Robert Williams',
          testIds: ['TST-010', 'TST-011'],
          testNames: ['Electrocardiogram (ECG)', 'Echocardiogram'],
          status: 'Scheduled',
          priority: 'Urgent',
          orderedBy: 'Dr. Feriel Dh',
          orderedAt: '2025-03-07T16:45:00',
          scheduledDate: '2025-03-09T11:30:00',
          notes: 'Patient has history of arrhythmia and shortness of breath.'
        },
        {
          id: 'ORD-5003',
          patientId: 'P-10049',
          patientName: 'Michael Brown',
          testIds: ['TST-007'],
          testNames: ['Chest X-ray'],
          status: 'Pending',
          priority: 'STAT',
          orderedBy: 'Dr. Feriel Dh',
          orderedAt: '2025-03-08T14:20:00',
          notes: 'COPD exacerbation assessment.'
        }
      ];
      
      setPatients(mockPatients);
      setTestCategories(mockTestCategories);
      setTestOrders(mockTestOrders);
      setIsLoading(false);
    }, []);
  
    // Format date for display
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    };
  
    // Handle order submission
    const handleSubmitOrder = (): void => {
      if (!selectedPatient || selectedTests.length === 0) return;
      
      const newOrder: TestOrder = {
        id: `ORD-${5000 + testOrders.length + 1}`,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        testIds: selectedTests.map(test => test.id),
        testNames: selectedTests.map(test => test.name),
        status: 'Pending',
        priority: testPriority,
        orderedBy: currentUser,
        orderedAt: currentDate.toISOString(),
        notes: orderNotes || undefined
      };
      
      setTestOrders([newOrder, ...testOrders]);
      resetForm();
      setIsModalOpen(false);
    };
  
    // Reset form fields
    const resetForm = (): void => {
      setSelectedPatient(null);
      setSelectedTests([]);
      setTestPriority('Routine');
      setOrderNotes('');
    };
  
    // Toggle test selection
    const toggleTestSelection = (test: Test): void => {
      const isSelected = selectedTests.some(t => t.id === test.id);
      if (isSelected) {
        setSelectedTests(selectedTests.filter(t => t.id !== test.id));
      } else {
        setSelectedTests([...selectedTests, test]);
      }
    };
  
    // Filter orders based on status
    const filteredOrders = testOrders.filter(order => 
      statusFilter === 'all' || order.status === statusFilter
    );
  
    // Get status badge
    const getStatusBadge = (status: string): JSX.Element => {
      const statusClasses = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Scheduled: 'bg-blue-100 text-blue-800',
        Completed: 'bg-green-100 text-green-800',
        Canceled: 'bg-red-100 text-red-800'
      };
  
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
          {status}
        </span>
      );
    };
  
    // Get priority badge
    const getPriorityBadge = (priority: string): JSX.Element => {
      const priorityClasses = {
        Routine: 'bg-green-100 text-green-800',
        Urgent: 'bg-yellow-100 text-yellow-800',
        STAT: 'bg-red-100 text-red-800'
      };
  
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityClasses[priority as keyof typeof priorityClasses]}`}>
          {priority}
        </span>
      );
    };
  
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium text-gray-900">Test Prescription</h2>
          <Button
            variant="primary"
            icon={<DocumentAddIcon className="h-5 w-5" />}
            onClick={() => setIsModalOpen(true)}
          >
            Order New Tests
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search test orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
        </div>
        
        <Card>
          {isLoading ? (
            <div className="text-center py-4">Loading test orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <FilterIcon className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No test orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or order new tests for your patients.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tests
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ordered At
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.patientName}</div>
                        <div className="text-xs text-gray-500">{order.patientId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.testNames.join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(order.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.orderedAt)}
                        {order.scheduledDate && (
                          <div className="text-xs">
                            Scheduled: {formatDate(order.scheduledDate)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="white"
                            size="sm"
                          >
                            View
                          </Button>
                          {order.status === 'Pending' && (
                            <Button
                              variant="danger"
                              size="sm"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        {/* Order Tests Modal */}
        <Modal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title="Order New Tests"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Patient
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {patients.map((patient) => (
                <div 
                  key={patient.id} 
                  className={`border rounded-md p-3 cursor-pointer ${
                    selectedPatient?.id === patient.id ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium">{patient.name}</h3>
                      <p className="text-xs text-gray-500">
                        {patient.id} • {patient.age} yrs • {patient.gender}
                        {patient.roomNumber && ` • Room ${patient.roomNumber}`}
                      </p>
                    </div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${patient.status === 'Admitted' ? 'bg-blue-100 text-blue-800' : 
                        patient.status === 'Emergency' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}`}
                    >
                      {patient.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPatient && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Tests
                </label>
                <div className="space-y-4">
                  {testCategories.map((category) => (
                    <div key={category.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 font-medium">
                        {category.name}
                      </div>
                      <div className="divide-y">
                        {category.tests.map((test) => {
                          const isSelected = selectedTests.some(t => t.id === test.id);
                          return (
                            <div 
                              key={test.id}
                              className={`p-3 cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-primary-50' : ''}`}
                              onClick={() => toggleTestSelection(test)}
                            >
                              <div className="flex items-start">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-primary-600 mt-1 mr-3"
                                  checked={isSelected}
                                  readOnly
                                />
                                <div>
                                  <h4 className="text-sm font-medium">{test.name}</h4>
                                  <p className="text-xs text-gray-500 mt-0.5">{test.description}</p>
                                  <div className="flex flex-wrap mt-1 gap-x-4 text-xs text-gray-500">
                                    {test.preparation && (
                                      <span>Prep: {test.preparation}</span>
                                    )}
                                    <span>Duration: {test.duration}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="test-priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="test-priority"
                    className="input-field"
                    value={testPriority}
                    onChange={(e) => setTestPriority(e.target.value as 'Routine' | 'Urgent' | 'STAT')}
                    required
                  >
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="STAT">STAT (Immediate)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="order-notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="order-notes"
                    className="input-field"
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Add any special instructions or clinical context"
                  ></textarea>
                </div>
              </div>
            </>
          )}
          
          <div className="flex justify-end space-x-3 pt-5 border-t mt-6">
            <Button 
              variant="white"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleSubmitOrder}
              disabled={!selectedPatient || selectedTests.length === 0}
            >
              {selectedTests.length > 0 ? `Order ${selectedTests.length} Test${selectedTests.length === 1 ? '' : 's'}` : 'Order Tests'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
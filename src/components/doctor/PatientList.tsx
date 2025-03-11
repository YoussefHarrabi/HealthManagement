import { useState, useEffect, JSX } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { SearchIcon, FilterIcon } from '@heroicons/react/outline';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  roomNumber?: string;
  appointmentTime?: string;
  status: 'Admitted' | 'Outpatient' | 'Emergency' | 'Discharged';
  priority: 'Normal' | 'Urgent' | 'Critical';
  diagnosis?: string;
  lastVisit?: string;
  assignedDoctor?: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
}

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const currentDate = new Date('2025-03-08 18:03:21');
  const currentUser = 'Dr. Feriel Mariem';

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
        status: 'Admitted',
        priority: 'Normal',
        diagnosis: 'Pneumonia',
        assignedDoctor: 'Dr. Feriel Mariem',
        vitalSigns: {
          bloodPressure: '120/80',
          heartRate: 75,
          temperature: 37.5,
          respiratoryRate: 16,
          oxygenSaturation: 96
        }
      },
      {
        id: 'P-10046',
        name: 'Emma Johnson',
        age: 32,
        gender: 'Female',
        appointmentTime: '2025-03-08T14:30:00',
        status: 'Outpatient',
        priority: 'Normal',
        diagnosis: 'Migraine',
        lastVisit: '2025-02-15',
        assignedDoctor: 'Dr. Feriel Mariem'
      },
      {
        id: 'P-10047',
        name: 'Robert Williams',
        age: 67,
        gender: 'Male',
        roomNumber: '210B',
        status: 'Admitted',
        priority: 'Urgent',
        diagnosis: 'Myocardial Infarction',
        assignedDoctor: 'Dr. Feriel Mariem',
        vitalSigns: {
          bloodPressure: '145/90',
          heartRate: 85,
          temperature: 36.9,
          respiratoryRate: 18,
          oxygenSaturation: 94
        }
      },
      {
        id: 'P-10048',
        name: 'Sarah Davis',
        age: 28,
        gender: 'Female',
        status: 'Emergency',
        priority: 'Critical',
        diagnosis: 'Acute Appendicitis',
        assignedDoctor: 'Dr. Feriel Mariem',
        vitalSigns: {
          bloodPressure: '130/85',
          heartRate: 102,
          temperature: 38.7,
          respiratoryRate: 22,
          oxygenSaturation: 97
        }
      },
      {
        id: 'P-10049',
        name: 'Michael Brown',
        age: 54,
        gender: 'Male',
        roomNumber: '405C',
        status: 'Admitted',
        priority: 'Urgent',
        diagnosis: 'COPD Exacerbation',
        assignedDoctor: 'Dr. Feriel Mariem',
        vitalSigns: {
          bloodPressure: '135/85',
          heartRate: 88,
          temperature: 37.2,
          respiratoryRate: 24,
          oxygenSaturation: 91
        }
      },
      {
        id: 'P-10050',
        name: 'Jennifer Wilson',
        age: 41,
        gender: 'Female',
        appointmentTime: '2025-03-08T16:15:00',
        status: 'Outpatient',
        priority: 'Normal',
        diagnosis: 'Hypertension',
        lastVisit: '2025-01-22',
        assignedDoctor: 'Dr. Feriel Mariem'
      },
      {
        id: 'P-10051',
        name: 'Thomas Miller',
        age: 72,
        gender: 'Male',
        status: 'Discharged',
        priority: 'Normal',
        diagnosis: 'Hip Replacement Recovery',
        lastVisit: '2025-03-01',
        assignedDoctor: 'Dr. Feriel Mariem'
      }
    ];
    
    setPatients(mockPatients);
    setFilteredPatients(mockPatients);
    setIsLoading(false);
  }, []);

  // Filter patients
  useEffect(() => {
    let result = patients;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(patient => 
        patient.name.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        (patient.diagnosis && patient.diagnosis.toLowerCase().includes(query))
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(patient => patient.status === statusFilter);
    }
    
    // Filter by priority
    if (priorityFilter !== 'all') {
      result = result.filter(patient => patient.priority === priorityFilter);
    }
    
    setFilteredPatients(result);
  }, [searchQuery, statusFilter, priorityFilter, patients]);

  // Get priority indicator
  const getPriorityIndicator = (priority: string): JSX.Element => {
    const priorityClasses = {
      Normal: 'bg-green-100 text-green-800',
      Urgent: 'bg-yellow-100 text-yellow-800',
      Critical: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityClasses[priority as keyof typeof priorityClasses]}`}>
        {priority}
      </span>
    );
  };

  // Format date and time
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Check if appointment is today
  const isAppointmentToday = (dateString?: string): boolean => {
    if (!dateString) return false;
    const appointmentDate = new Date(dateString);
    return (
      appointmentDate.getDate() === currentDate.getDate() &&
      appointmentDate.getMonth() === currentDate.getMonth() &&
      appointmentDate.getFullYear() === currentDate.getFullYear()
    );
  };

  // Check if vital signs are concerning
  const hasVitalSignConcerns = (vitalSigns?: Patient['vitalSigns']): boolean => {
    if (!vitalSigns) return false;
    
    const { heartRate, temperature, respiratoryRate, oxygenSaturation } = vitalSigns;
    
    return (
      (heartRate !== undefined && (heartRate > 100 || heartRate < 50)) ||
      (temperature !== undefined && (temperature > 38.0 || temperature < 36.0)) ||
      (respiratoryRate !== undefined && (respiratoryRate > 20 || respiratoryRate < 12)) ||
      (oxygenSaturation !== undefined && oxygenSaturation < 94)
    );
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading patient list...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">My Patients</h2>
        <Button
          variant="primary"
          size="sm"
        >
          Add New Patient
        </Button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-4 border">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex space-x-2">
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Admitted">Admitted</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Emergency">Emergency</option>
              <option value="Discharged">Discharged</option>
            </select>
            <select
              className="input-field"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
        
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <FilterIcon className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room/Appointment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diagnosis
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vitals
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr 
                    key={patient.id}
                    className={patient.priority === 'Critical' ? 'bg-red-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.id} • {patient.age} yrs • {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${patient.status === 'Admitted' ? 'bg-blue-100 text-blue-800' : 
                          patient.status === 'Outpatient' ? 'bg-green-100 text-green-800' : 
                            patient.status === 'Emergency' ? 'bg-red-100 text-red-800' : 
                              'bg-gray-100 text-gray-800'}`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.roomNumber ? (
                        <span>Room {patient.roomNumber}</span>
                      ) : patient.appointmentTime ? (
                        <span className={isAppointmentToday(patient.appointmentTime) ? 'text-primary-600 font-medium' : ''}>
                          {formatDateTime(patient.appointmentTime)}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.diagnosis || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityIndicator(patient.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.vitalSigns ? (
                        <div className="flex items-center">
                          {hasVitalSignConcerns(patient.vitalSigns) && (
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-1" />
                          )}
                          <span className="text-sm">
                            BP: {patient.vitalSigns.bloodPressure || 'N/A'}
                            {' • '}
                            HR: {patient.vitalSigns.heartRate || 'N/A'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not recorded</span>
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
                        <Button
                          variant="primary"
                          size="sm"
                        >
                          Manage
                        </Button>
                      </div>
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
}
import { useState, useEffect, JSX } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { 
  ClipboardCheckIcon, 
  UserIcon, 
  ClockIcon, 
  ExclamationIcon
} from '@heroicons/react/outline';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  roomNumber?: string;
  status: string;
}

interface Staff {
  id: string;
  name: string;
  role: 'Nurse' | 'Technician' | 'Resident';
  department: string;
  avatarUrl?: string;
  currentLoad: number; // Number of current tasks assigned
  specialties?: string[];
}

interface Task {
  id: string;
  title: string;
  patientId: string;
  patientName: string;
  assigneeId?: string;
  assigneeName?: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed';
  description: string;
  createdBy: string;
  createdAt: string;
}

export default function TaskAssignment() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const currentDate = new Date('2025-03-08 18:05:41');
  const currentUser = 'Dr. Feriel Mariem';

  // Format current date as YYYY-MM-DD
  const formattedCurrentDate = currentDate.toISOString().split('T')[0];
  
  // Calculate min and max date for due date input
  const minDueDate = formattedCurrentDate;
  const maxDueDate = new Date(currentDate);
  maxDueDate.setDate(maxDueDate.getDate() + 14); // Maximum 14 days from now
  const formattedMaxDate = maxDueDate.toISOString().split('T')[0];

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
    
    const mockStaff: Staff[] = [
      {
        id: 'S-1001',
        name: 'Alice Johnson',
        role: 'Nurse',
        department: 'Internal Medicine',
        avatarUrl: '/images/staff-alice.jpg',
        currentLoad: 3,
        specialties: ['Wound Care', 'IV Administration']
      },
      {
        id: 'S-1002',
        name: 'Bob Thompson',
        role: 'Nurse',
        department: 'Internal Medicine',
        avatarUrl: '/images/staff-bob.jpg',
        currentLoad: 1,
        specialties: ['Cardiology', 'Critical Care']
      },
      {
        id: 'S-1003',
        name: 'Carol Martinez',
        role: 'Technician',
        department: 'Radiology',
        avatarUrl: '/images/staff-carol.jpg',
        currentLoad: 2,
        specialties: ['X-Ray', 'CT Scan']
      },
      {
        id: 'S-1004',
        name: 'David Garcia',
        role: 'Resident',
        department: 'Surgery',
        avatarUrl: '/images/staff-david.jpg',
        currentLoad: 4,
        specialties: ['General Surgery', 'Trauma']
      },
      {
        id: 'S-1005',
        name: 'Eva Wilson',
        role: 'Nurse',
        department: 'Emergency',
        avatarUrl: '/images/staff-eva.jpg',
        currentLoad: 0,
        specialties: ['Triage', 'Emergency Care']
      }
    ];
    
    const mockTasks: Task[] = [
      {
        id: 'T-20010',
        title: 'Administer medication',
        patientId: 'P-10045',
        patientName: 'John Smith',
        assigneeId: 'S-1001',
        assigneeName: 'Alice Johnson',
        dueDate: '2025-03-08T22:00:00',
        priority: 'High',
        status: 'Assigned',
        description: 'Administer 500mg Ceftriaxone IV every 12 hours.',
        createdBy: 'Dr. Feriel Mariem',
        createdAt: '2025-03-08T12:30:00'
      },
      {
        id: 'T-20011',
        title: 'Obtain blood samples',
        patientId: 'P-10047',
        patientName: 'Robert Williams',
        assigneeId: 'S-1002',
        assigneeName: 'Bob Thompson',
        dueDate: '2025-03-09T08:00:00',
        priority: 'Medium',
        status: 'Assigned',
        description: 'Collect blood samples for CBC, electrolytes, and cardiac enzymes.',
        createdBy: 'Dr. Feriel Mariem',
        createdAt: '2025-03-08T14:15:00'
      },
      {
        id: 'T-20012',
        title: 'Chest X-ray',
        patientId: 'P-10049',
        patientName: 'Michael Brown',
        assigneeId: 'S-1003',
        assigneeName: 'Carol Martinez',
        dueDate: '2025-03-08T19:00:00',
        priority: 'Medium',
        status: 'In Progress',
        description: 'Perform AP and lateral chest X-ray to assess COPD status.',
        createdBy: 'Dr. Feriel Mariem',
        createdAt: '2025-03-08T15:00:00'
      },
      {
        id: 'T-20013',
        title: 'Post-op assessment',
        patientId: 'P-10048',
        patientName: 'Sarah Davis',
        status: 'Pending',
        priority: 'High',
        dueDate: '2025-03-08T20:30:00',
        description: 'Conduct post-operative assessment following appendectomy.',
        createdBy: 'Dr. Feriel Mariem',
        createdAt: '2025-03-08T17:45:00'
      }
    ];
    
    setPatients(mockPatients);
    setStaffMembers(mockStaff);
    setTasks(mockTasks);
    setIsLoading(false);
  }, []);

  // Get staff load indicator
  const getLoadIndicator = (load: number): JSX.Element => {
    let color = 'bg-green-500';
    if (load >= 5) {
      color = 'bg-red-500';
    } else if (load >= 3) {
      color = 'bg-yellow-500';
    }
    
    return (
      <div className="flex items-center">
        <div className={`h-2 w-2 rounded-full ${color} mr-1`}></div>
        <span className="text-xs text-gray-500">{load} tasks</span>
      </div>
    );
  };

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

  // Check if task is overdue
  const isTaskOverdue = (dueDate: string): boolean => {
    return new Date(dueDate) < currentDate;
  };

  // Handle task submission
  const handleSubmitTask = (): void => {
    if (!selectedPatient || !taskTitle || !taskDescription || !taskDueDate) return;
    
    const newTask: Task = {
      id: `T-${20000 + tasks.length + 1}`,
      title: taskTitle,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      assigneeId: selectedStaff?.id,
      assigneeName: selectedStaff?.name,
      dueDate: `${taskDueDate}T12:00:00`,
      priority: taskPriority,
      status: selectedStaff ? 'Assigned' : 'Pending',
      description: taskDescription,
      createdBy: currentUser,
      createdAt: currentDate.toISOString()
    };
    
    setTasks([newTask, ...tasks]);
    resetForm();
    setIsModalOpen(false);
  };

  // Reset form fields
  const resetForm = (): void => {
    setSelectedPatient(null);
    setSelectedStaff(null);
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('Medium');
    setTaskDueDate('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Task Assignment</h2>
        <Button
          variant="primary"
          icon={<ClipboardCheckIcon className="h-5 w-5" />}
          onClick={() => setIsModalOpen(true)}
        >
          Assign New Task
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">Loading tasks...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Tasks */}
          <Card title="Assigned Tasks">
            <div className="space-y-3">
              {tasks.filter(task => task.status !== 'Pending').length > 0 ? (
                tasks
                  .filter(task => task.status !== 'Pending')
                  .map((task) => (
                    <div 
                      key={task.id} 
                      className={`p-4 border rounded-lg ${
                        task.status === 'Completed' 
                          ? 'bg-gray-50' 
                          : isTaskOverdue(task.dueDate) 
                            ? 'bg-red-50 border-red-200'
                            : 'bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-500">Patient: {task.patientName}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Assigned to: {task.assigneeName || 'Unassigned'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span 
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              task.priority === 'High' 
                                ? 'bg-red-100 text-red-800' 
                                : task.priority === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {task.priority}
                          </span>
                          <div className="text-xs mt-1 text-gray-500 flex items-center justify-end">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Due: {formatDate(task.dueDate)}
                            {isTaskOverdue(task.dueDate) && (
                              <span className="ml-1 text-red-600">(Overdue)</span>
                            )}
                          </div>
                          <span 
                                                      className={`inline-flex mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                                                        task.status === 'Completed' 
                                                          ? 'bg-green-100 text-green-800' 
                                                          : task.status === 'In Progress'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                      }`}
                                                    >
                                                      {task.status}
                                                    </span>
                                                  </div>
                                                </div>
                                                <p className="text-sm mt-3 text-gray-600">{task.description}</p>
                                              </div>
                                            ))
                                        ) : (
                                          <div className="text-center py-6 text-gray-500">
                                            No assigned tasks to display
                                          </div>
                                        )}
                                      </div>
                                    </Card>
                                    
                                    {/* Pending Tasks */}
                                    <Card title="Unassigned Tasks">
                                      <div className="space-y-3">
                                        {tasks.filter(task => task.status === 'Pending').length > 0 ? (
                                          tasks
                                            .filter(task => task.status === 'Pending')
                                            .map((task) => (
                                              <div 
                                                key={task.id} 
                                                className={`p-4 border rounded-lg ${
                                                  isTaskOverdue(task.dueDate) 
                                                    ? 'bg-red-50 border-red-200'
                                                    : 'bg-white'
                                                }`}
                                              >
                                                <div className="flex justify-between items-start">
                                                  <div>
                                                    <h3 className="text-base font-medium flex items-center">
                                                      {task.title} 
                                                      <ExclamationIcon className="h-4 w-4 text-yellow-500 ml-1" />
                                                    </h3>
                                                    <p className="text-sm text-gray-500">Patient: {task.patientName}</p>
                                                  </div>
                                                  <div className="text-right">
                                                    <span 
                                                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                        task.priority === 'High' 
                                                          ? 'bg-red-100 text-red-800' 
                                                          : task.priority === 'Medium'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                      }`}
                                                    >
                                                      {task.priority}
                                                    </span>
                                                    <div className="text-xs mt-1 text-gray-500 flex items-center justify-end">
                                                      <ClockIcon className="h-3 w-3 mr-1" />
                                                      Due: {formatDate(task.dueDate)}
                                                      {isTaskOverdue(task.dueDate) && (
                                                        <span className="ml-1 text-red-600">(Overdue)</span>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                                <p className="text-sm mt-3 text-gray-600">{task.description}</p>
                                                
                                                <div className="mt-4">
                                                  <h4 className="text-xs font-medium text-gray-700 mb-2">Assign To:</h4>
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {staffMembers
                                                      .filter(staff => ['Nurse', 'Technician'].includes(staff.role))
                                                      .map(staff => (
                                                        <button
                                                          key={staff.id}
                                                          onClick={() => {
                                                            setTasks(tasks.map(t => 
                                                              t.id === task.id 
                                                                ? { 
                                                                    ...t, 
                                                                    assigneeId: staff.id,
                                                                    assigneeName: staff.name,
                                                                    status: 'Assigned'
                                                                  }
                                                                : t
                                                            ));
                                                          }}
                                                          className="flex items-center p-2 border rounded-md hover:bg-gray-50 text-left"
                                                        >
                                                          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                            {staff.avatarUrl ? (
                                                              <img src={staff.avatarUrl} alt={staff.name} className="h-8 w-8 object-cover" />
                                                            ) : (
                                                              <UserIcon className="h-8 w-8 p-1 text-gray-500" />
                                                            )}
                                                          </div>
                                                          <div className="ml-2 flex-1">
                                                            <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                                                            <div className="text-xs text-gray-500">{staff.role} • {staff.department}</div>
                                                          </div>
                                                          {getLoadIndicator(staff.currentLoad)}
                                                        </button>
                                                      ))}
                                                  </div>
                                                </div>
                                              </div>
                                            ))
                                        ) : (
                                          <div className="text-center py-6 text-gray-500">
                                            No pending tasks to display
                                          </div>
                                        )}
                                      </div>
                                    </Card>
                                  </div>
                                )}
                                
                                {/* Create Task Modal */}
                                <Modal
                                  open={isModalOpen}
                                  setOpen={setIsModalOpen}
                                  title="Assign New Task"
                                >
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Patient
                                      </label>
                                      <div className="grid grid-cols-1 gap-2">
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
                                          <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
                                            Task Title
                                          </label>
                                          <input
                                            type="text"
                                            id="task-title"
                                            className="input-field"
                                            value={taskTitle}
                                            onChange={(e) => setTaskTitle(e.target.value)}
                                            required
                                          />
                                        </div>
                                        
                                        <div>
                                          <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
                                            Task Description
                                          </label>
                                          <textarea
                                            id="task-description"
                                            className="input-field"
                                            rows={3}
                                            value={taskDescription}
                                            onChange={(e) => setTaskDescription(e.target.value)}
                                            required
                                          ></textarea>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-1">
                                              Priority
                                            </label>
                                            <select
                                              id="task-priority"
                                              className="input-field"
                                              value={taskPriority}
                                              onChange={(e) => setTaskPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                                              required
                                            >
                                              <option value="Low">Low</option>
                                              <option value="Medium">Medium</option>
                                              <option value="High">High</option>
                                            </select>
                                          </div>
                                          <div>
                                            <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700 mb-1">
                                              Due Date
                                            </label>
                                            <input
                                              type="date"
                                              id="task-due-date"
                                              className="input-field"
                                              min={minDueDate}
                                              max={formattedMaxDate}
                                              value={taskDueDate}
                                              onChange={(e) => setTaskDueDate(e.target.value)}
                                              required
                                            />
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Assign To (Optional)
                                          </label>
                                          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                                            {staffMembers
                                              .filter(staff => ['Nurse', 'Technician'].includes(staff.role))
                                              .map((staff) => (
                                                <div 
                                                  key={staff.id} 
                                                  className={`border rounded-md p-3 cursor-pointer ${
                                                    selectedStaff?.id === staff.id ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:bg-gray-50'
                                                  }`}
                                                  onClick={() => setSelectedStaff(selectedStaff?.id === staff.id ? null : staff)}
                                                >
                                                  <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                      {staff.avatarUrl ? (
                                                        <img src={staff.avatarUrl} alt={staff.name} className="h-8 w-8 object-cover" />
                                                      ) : (
                                                        <UserIcon className="h-8 w-8 p-1 text-gray-500" />
                                                      )}
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                      <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                                                      <div className="text-xs text-gray-500">{staff.role} • {staff.department}</div>
                                                    </div>
                                                    {getLoadIndicator(staff.currentLoad)}
                                                  </div>
                                                </div>
                                              ))}
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
                                        onClick={handleSubmitTask}
                                        disabled={!selectedPatient || !taskTitle || !taskDescription || !taskDueDate}
                                      >
                                        Assign Task
                                      </Button>
                                    </div>
                                  </div>
                                </Modal>
                              </div>
                            );
                          }
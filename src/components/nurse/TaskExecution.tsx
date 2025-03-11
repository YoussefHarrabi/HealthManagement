import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { 
  CheckCircleIcon, 
  ClipboardCheckIcon, 
  XCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  ArrowLeftIcon
} from '@heroicons/react/outline';

interface Task {
  id: string;
  title: string;
  patientId: string;
  patientName: string;
  roomNumber?: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Assigned' | 'In Progress' | 'Completed' | 'Canceled';
  description: string;
  steps?: TaskStep[];
  assignedBy: string;
  assignedAt: string;
  completedAt?: string;
  notes?: string;
}

interface TaskStep {
  id: string;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
}

interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  painLevel?: number;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  roomNumber?: string;
  diagnosis?: string;
  allergies?: string[];
  vitalSigns?: VitalSigns;
  lastUpdated?: string;
}

export default function TaskExecution() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [patients, setPatients] = useState<Record<string, Patient>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [executionNotes, setExecutionNotes] = useState<string>('');
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({});
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const currentDate = new Date('2025-03-08 18:13:01');
  const currentUser = 'Feriel Mariem';

  // Mock data fetching
  useEffect(() => {
    // In a real app, this would be an API call
    const mockTasks: Task[] = [
      {
        id: 'T-20010',
        title: 'Administer medication',
        patientId: 'P-10045',
        patientName: 'John Smith',
        roomNumber: '302A',
        dueDate: '2025-03-08T22:00:00',
        priority: 'High',
        status: 'Assigned',
        description: 'Administer 500mg Ceftriaxone IV every 12 hours.',
        steps: [
          {
            id: 'S-1',
            description: 'Verify patient identity using two identifiers',
            isCompleted: false
          },
          {
            id: 'S-2',
            description: 'Check medication against order (right patient, drug, dose, route, time)',
            isCompleted: false
          },
          {
            id: 'S-3',
            description: 'Prepare Ceftriaxone 500mg for IV administration',
            isCompleted: false
          },
          {
            id: 'S-4',
            description: 'Administer medication through IV line',
            isCompleted: false
          },
          {
            id: 'S-5',
            description: 'Document administration in patient chart',
            isCompleted: false
          }
        ],
        assignedBy: 'Dr. Sarah Chen',
        assignedAt: '2025-03-08T12:30:00'
      },
      {
        id: 'T-20011',
        title: 'Check vital signs',
        patientId: 'P-10045',
        patientName: 'John Smith',
        roomNumber: '302A',
        dueDate: '2025-03-08T18:00:00',
        priority: 'Medium',
        status: 'In Progress',
        description: 'Check blood pressure, heart rate, temperature, and respiratory rate.',
        steps: [
          {
            id: 'S-1',
            description: 'Verify patient identity using two identifiers',
            isCompleted: true,
            completedAt: '2025-03-08T17:55:00'
          },
          {
            id: 'S-2',
            description: 'Measure blood pressure',
            isCompleted: false
          },
          {
            id: 'S-3',
            description: 'Measure heart rate',
            isCompleted: false
          },
          {
            id: 'S-4',
            description: 'Measure temperature',
            isCompleted: false
          },
          {
            id: 'S-5',
            description: 'Count respiratory rate',
            isCompleted: false
          },
          {
            id: 'S-6',
            description: 'Measure oxygen saturation',
            isCompleted: false
          },
          {
            id: 'S-7',
            description: 'Assess pain level',
            isCompleted: false
          },
          {
            id: 'S-8',
            description: 'Document vital signs in patient chart',
            isCompleted: false
          }
        ],
        assignedBy: 'Dr. Sarah Chen',
        assignedAt: '2025-03-08T13:15:00'
      },
      {
        id: 'T-20012',
        title: 'Wound dressing change',
        patientId: 'P-10047',
        patientName: 'Robert Williams',
        roomNumber: '210B',
        dueDate: '2025-03-08T20:00:00',
        priority: 'Medium',
        status: 'Assigned',
        description: 'Change surgical wound dressing using sterile technique. Document wound appearance.',
        steps: [
          {
            id: 'S-1',
            description: 'Verify patient identity using two identifiers',
            isCompleted: false
          },
          {
            id: 'S-2',
            description: 'Gather necessary supplies',
            isCompleted: false
          },
          {
            id: 'S-3',
            description: 'Perform hand hygiene',
            isCompleted: false
          },
          {
            id: 'S-4',
            description: 'Remove old dressing and dispose properly',
            isCompleted: false
          },
          {
            id: 'S-5',
            description: 'Assess wound (size, color, drainage, odor)',
            isCompleted: false
          },
          {
            id: 'S-6',
            description: 'Clean wound with sterile solution',
            isCompleted: false
          },
          {
            id: 'S-7',
            description: 'Apply new sterile dressing',
            isCompleted: false
          },
          {
            id: 'S-8',
            description: 'Document wound assessment and dressing change',
            isCompleted: false
          }
        ],
        assignedBy: 'Dr. Michael Wong',
        assignedAt: '2025-03-08T14:45:00'
      }
    ];

    const mockPatients: Record<string, Patient> = {
      'P-10045': {
        id: 'P-10045',
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        roomNumber: '302A',
        diagnosis: 'Pneumonia',
        allergies: ['Penicillin', 'Sulfa drugs'],
        vitalSigns: {
          bloodPressure: '120/80',
          heartRate: 78,
          temperature: 37.2,
          respiratoryRate: 18,
          oxygenSaturation: 97,
          painLevel: 2
        },
        lastUpdated: '2025-03-08T12:00:00'
      },
      'P-10047': {
        id: 'P-10047',
        name: 'Robert Williams',
        age: 67,
        gender: 'Male',
        roomNumber: '210B',
        diagnosis: 'Post-op: Total Knee Replacement',
        allergies: ['Latex'],
        vitalSigns: {
          bloodPressure: '135/85',
          heartRate: 72,
          temperature: 36.9,
          respiratoryRate: 16,
          oxygenSaturation: 98,
          painLevel: 4
        },
        lastUpdated: '2025-03-08T14:30:00'
      }
    };
    
    setTasks(mockTasks);
    setPatients(mockPatients);
    setIsLoading(false);
  }, []);

  // Get selected task
  const selectedTask = selectedTaskId ? tasks.find(task => task.id === selectedTaskId) : null;
  
  // Get patient data for selected task
  const selectedPatient = selectedTask ? patients[selectedTask.patientId] : null;

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

  // Get time remaining
  const getTimeRemaining = (dueDate: string): string => {
    const dueDateTime = new Date(dueDate);
    const diffInMs = dueDateTime.getTime() - currentDate.getTime();
    
    if (diffInMs < 0) return 'Overdue';
    
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMins / 60);
    const mins = diffInMins % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Handle task step completion
  const toggleStepCompletion = (taskId: string, stepId: string): void => {
    setTasks(tasks.map(task => {
      if (task.id === taskId && task.steps) {
        return {
          ...task,
          steps: task.steps.map(step => {
            if (step.id === stepId) {
              const newCompletionState = !step.isCompleted;
              return {
                ...step,
                isCompleted: newCompletionState,
                completedAt: newCompletionState ? currentDate.toISOString() : undefined
              };
            }
            return step;
          })
        };
      }
      return task;
    }));
  };

  // Calculate task completion percentage
  const getTaskCompletionPercentage = (task: Task): number => {
    if (!task.steps || task.steps.length === 0) return 0;
    
    const completedSteps = task.steps.filter(step => step.isCompleted).length;
    return Math.round((completedSteps / task.steps.length) * 100);
  };

  // Check if all steps are completed
  const areAllStepsCompleted = (task: Task): boolean => {
    if (!task.steps || task.steps.length === 0) return false;
    return task.steps.every(step => step.isCompleted);
  };

  // Start task execution
  const startTaskExecution = (taskId: string): void => {
    setSelectedTaskId(taskId);
    setIsExecuting(true);
    
    // Initialize vital signs if this is a vital signs task
    const task = tasks.find(t => t.id === taskId);
    if (task && task.title.toLowerCase().includes('vital signs')) {
      const patient = patients[task.patientId];
      if (patient && patient.vitalSigns) {
        setVitalSigns({ ...patient.vitalSigns });
      } else {
        setVitalSigns({});
      }
    }
    
    // Mark task as in progress if it's not already
    if (task && task.status === 'Assigned') {
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, status: 'In Progress' } : t
      ));
    }
  };

  // Complete task execution
  const completeTaskExecution = (): void => {
    if (!selectedTaskId) return;
    
    const updatedTasks = tasks.map(task => {
      if (task.id === selectedTaskId) {
        // Update task status
        const updatedTask: Task = { 
          ...task, 
          status: 'Completed',
          completedAt: currentDate.toISOString(),
          notes: executionNotes || task.notes
        };
        
        // If this is a vital signs task, update patient vital signs
        if (task.title.toLowerCase().includes('vital signs') && task.patientId) {
          setPatients({
            ...patients,
            [task.patientId]: {
              ...patients[task.patientId],
              vitalSigns,
              lastUpdated: currentDate.toISOString()
            }
          });
        }
        
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    setSelectedTaskId(null);
    setIsExecuting(false);
    setExecutionNotes('');
    setVitalSigns({});
  };

  // Cancel task execution
  const cancelTaskExecution = (): void => {
    setSelectedTaskId(null);
    setIsExecuting(false);
    setExecutionNotes('');
    setVitalSigns({});
  };

  return (
    <div className="space-y-6">
      {isExecuting && selectedTask ? (
        <div className="space-y-6">
          <div className="flex items-center">
            <Button
              variant="white"
              size="sm"
              icon={<ArrowLeftIcon className="h-4 w-4" />}
              onClick={cancelTaskExecution}
            >
              Back to Tasks
            </Button>
            <h2 className="text-xl font-medium text-gray-900 ml-4">
              Executing: {selectedTask.title}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Task Execution */}
            <div className="md:col-span-2 space-y-4">
              <Card>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium">{selectedTask.title}</h3>
                        <span 
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            selectedTask.priority === 'High' 
                              ? 'bg-red-100 text-red-800' 
                              : selectedTask.priority === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {selectedTask.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{selectedTask.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-1">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span className={`text-sm font-medium ${
                          isTaskOverdue(selectedTask.dueDate) ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {getTimeRemaining(selectedTask.dueDate)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">Due: {formatDate(selectedTask.dueDate)}</div>
                    </div>
                  </div>

                  {/* Task Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Task Progress</span>
                      <span className="text-sm text-gray-500">
                        {getTaskCompletionPercentage(selectedTask)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${getTaskCompletionPercentage(selectedTask)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Task Steps */}
                  {selectedTask.steps && selectedTask.steps.length > 0 && (
                    <div className="mt-4 border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 font-medium border-b">
                        Task Steps
                      </div>
                      <div className="divide-y">
                        {selectedTask.steps.map((step) => (
                          <div 
                            key={step.id}
                            className={`p-3 flex items-start ${step.isCompleted ? 'bg-green-50' : ''}`}
                          >
                            <div className="mr-3 mt-0.5">
                              <input
                                type="checkbox"
                                className="h-5 w-5 text-primary-600"
                                checked={step.isCompleted}
                                onChange={() => toggleStepCompletion(selectedTask.id, step.id)}
                              />
                            </div>
                            <div className="flex-1">
                              <p className={`${step.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {step.description}
                              </p>
                              {step.completedAt && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Completed at {formatDate(step.completedAt)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vital Signs Input (if applicable) */}
                  {selectedTask.title.toLowerCase().includes('vital signs') && (
                    <div className="mt-4 border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 font-medium border-b">
                        Record Vital Signs
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Blood Pressure
                          </label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="e.g., 120/80"
                            value={vitalSigns.bloodPressure || ''}
                            onChange={(e) => setVitalSigns({...vitalSigns, bloodPressure: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Heart Rate (bpm)
                          </label>
                          <input
                            type="number"
                            className="input-field"
                            placeholder="e.g., 72"
                            value={vitalSigns.heartRate || ''}
                            onChange={(e) => setVitalSigns({...vitalSigns, heartRate: parseInt(e.target.value) || undefined})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Temperature (°C)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            className="input-field"
                            placeholder="e.g., 37.0"
                            value={vitalSigns.temperature || ''}
                            onChange={(e) => setVitalSigns({...vitalSigns, temperature: parseFloat(e.target.value) || undefined})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Respiratory Rate (breaths/min)
                          </label>
                          <input
                            type="number"
                            className="input-field"
                            placeholder="e.g., 16"
                            value={vitalSigns.respiratoryRate || ''}
                            onChange={(e) => setVitalSigns({...vitalSigns, respiratoryRate: parseInt(e.target.value) || undefined})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Oxygen Saturation (%)
                          </label>
                          <input
                            type="number"
                            className="input-field"
                            placeholder="e.g., 98"
                            value={vitalSigns.oxygenSaturation || ''}
                            onChange={(e) => setVitalSigns({...vitalSigns, oxygenSaturation: parseInt(e.target.value) || undefined})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pain Level (0-10)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            className="input-field"
                            placeholder="e.g., 2"
                            value={vitalSigns.painLevel || ''}
                            onChange={(e) => setVitalSigns({...vitalSigns, painLevel: parseInt(e.target.value) || undefined})}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                                  {/* Execution Notes */}
                                  <div className="mt-4">
                    <label htmlFor="execution-notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Execution Notes
                    </label>
                    <textarea
                      id="execution-notes"
                      className="input-field"
                      rows={3}
                      value={executionNotes}
                      onChange={(e) => setExecutionNotes(e.target.value)}
                      placeholder="Enter any relevant notes, observations, or issues encountered during task execution..."
                    ></textarea>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      variant="white"
                      onClick={cancelTaskExecution}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      icon={<CheckCircleIcon className="h-5 w-5" />}
                      onClick={completeTaskExecution}
                      disabled={
                        (selectedTask.steps && selectedTask.steps.length > 0 && !areAllStepsCompleted(selectedTask)) ||
                        (selectedTask.title.toLowerCase().includes('vital signs') && 
                         (!vitalSigns.bloodPressure || !vitalSigns.heartRate || 
                          !vitalSigns.temperature || !vitalSigns.respiratoryRate || 
                          !vitalSigns.oxygenSaturation))
                      }
                    >
                      Complete Task
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Patient Information */}
            <div className="md:col-span-1 space-y-4">
              {selectedPatient ? (
                <Card title="Patient Information">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">{selectedPatient.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedPatient.id} • {selectedPatient.age} years • {selectedPatient.gender}
                      </p>
                      {selectedPatient.roomNumber && (
                        <p className="text-sm font-medium mt-1">Room: {selectedPatient.roomNumber}</p>
                      )}
                    </div>
                    
                    {selectedPatient.diagnosis && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Diagnosis</h4>
                        <p className="text-sm text-gray-900">{selectedPatient.diagnosis}</p>
                      </div>
                    )}
                    
                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Allergies</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPatient.allergies.map((allergy, index) => (
                            <span 
                              key={index}
                              className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedPatient.vitalSigns && (
                      <div>
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium text-gray-700">Last Recorded Vitals</h4>
                          {selectedPatient.lastUpdated && (
                            <span className="text-xs text-gray-500">
                              {formatDate(selectedPatient.lastUpdated)}
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-2 space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="block text-xs text-gray-500">Blood Pressure</span>
                              <span className="font-medium">{selectedPatient.vitalSigns.bloodPressure || 'N/A'}</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="block text-xs text-gray-500">Heart Rate</span>
                              <span className="font-medium">{selectedPatient.vitalSigns.heartRate || 'N/A'} bpm</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="block text-xs text-gray-500">Temperature</span>
                              <span className="font-medium">{selectedPatient.vitalSigns.temperature || 'N/A'} °C</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="block text-xs text-gray-500">Resp. Rate</span>
                              <span className="font-medium">{selectedPatient.vitalSigns.respiratoryRate || 'N/A'} /min</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="block text-xs text-gray-500">SpO2</span>
                              <span className="font-medium">{selectedPatient.vitalSigns.oxygenSaturation || 'N/A'}%</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <span className="block text-xs text-gray-500">Pain</span>
                              <span className="font-medium">{selectedPatient.vitalSigns.painLevel !== undefined ? `${selectedPatient.vitalSigns.painLevel}/10` : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <Card title="Patient Information">
                  <div className="text-center py-6 text-gray-500">
                    No patient information available
                  </div>
                </Card>
              )}
              
              <Card title="Additional Resources">
                <div className="space-y-2">
                  <Button
                    variant="white"
                    size="sm"
                    className="w-full justify-start"
                    icon={<DocumentTextIcon className="h-5 w-5" />}
                  >
                    Medication Administration Protocol
                  </Button>
                  <Button
                    variant="white"
                    size="sm"
                    className="w-full justify-start"
                    icon={<DocumentTextIcon className="h-5 w-5" />}
                  >
                    Vital Signs Standard Range
                  </Button>
                  <Button
                    variant="white"
                    size="sm"
                    className="w-full justify-start"
                    icon={<DocumentTextIcon className="h-5 w-5" />}
                  >
                    Wound Care Guidelines
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-gray-900">Task Execution</h2>
        
          </div>
          
          {isLoading ? (
            <div className="text-center py-4">Loading tasks...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tasks by Priority */}
              <Card title="High Priority Tasks">
                <div className="space-y-3">
                  {tasks.filter(task => task.priority === 'High' && task.status !== 'Completed' && task.status !== 'Canceled').length > 0 ? (
                    tasks
                      .filter(task => task.priority === 'High' && task.status !== 'Completed' && task.status !== 'Canceled')
                      .map((task) => (
                        <div 
                          key={task.id} 
                          className={`p-3 border rounded-md ${isTaskOverdue(task.dueDate) ? 'bg-red-50 border-red-200' : 'bg-white'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-base font-medium">{task.title}</h3>
                              <div className="text-sm text-gray-500 mt-0.5">
                                Patient: {task.patientName}
                                {task.roomNumber && ` (Room ${task.roomNumber})`}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-sm font-medium text-red-600">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {getTimeRemaining(task.dueDate)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<ClipboardCheckIcon className="h-4 w-4" />}
                              onClick={() => startTaskExecution(task.id)}
                            >
                              Execute
                            </Button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No high priority tasks
                    </div>
                  )}
                </div>
              </Card>
              
              <Card title="Medium Priority Tasks">
                <div className="space-y-3">
                  {tasks.filter(task => task.priority === 'Medium' && task.status !== 'Completed' && task.status !== 'Canceled').length > 0 ? (
                    tasks
                      .filter(task => task.priority === 'Medium' && task.status !== 'Completed' && task.status !== 'Canceled')
                      .map((task) => (
                        <div 
                          key={task.id} 
                          className={`p-3 border rounded-md ${isTaskOverdue(task.dueDate) ? 'bg-red-50 border-red-200' : 'bg-white'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-base font-medium">{task.title}</h3>
                              <div className="text-sm text-gray-500 mt-0.5">
                                Patient: {task.patientName}
                                {task.roomNumber && ` (Room ${task.roomNumber})`}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-sm font-medium text-yellow-600">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {getTimeRemaining(task.dueDate)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<ClipboardCheckIcon className="h-4 w-4" />}
                              onClick={() => startTaskExecution(task.id)}
                            >
                              Execute
                            </Button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No medium priority tasks
                    </div>
                  )}
                </div>
              </Card>
              
              <Card title="Low Priority Tasks">
                <div className="space-y-3">
                  {tasks.filter(task => task.priority === 'Low' && task.status !== 'Completed' && task.status !== 'Canceled').length > 0 ? (
                    tasks
                      .filter(task => task.priority === 'Low' && task.status !== 'Completed' && task.status !== 'Canceled')
                      .map((task) => (
                        <div 
                          key={task.id} 
                          className={`p-3 border rounded-md ${isTaskOverdue(task.dueDate) ? 'bg-red-50 border-red-200' : 'bg-white'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-base font-medium">{task.title}</h3>
                              <div className="text-sm text-gray-500 mt-0.5">
                                Patient: {task.patientName}
                                {task.roomNumber && ` (Room ${task.roomNumber})`}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-sm font-medium text-green-600">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {getTimeRemaining(task.dueDate)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<ClipboardCheckIcon className="h-4 w-4" />}
                              onClick={() => startTaskExecution(task.id)}
                            >
                              Execute
                            </Button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No low priority tasks
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
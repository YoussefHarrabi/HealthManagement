import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  FilterIcon
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
  assignedBy: string;
  assignedAt: string;
  completedAt?: string;
  notes?: string;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const currentDate = new Date('2025-03-08 18:11:05');
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
        assignedBy: 'Dr. Michael Wong',
        assignedAt: '2025-03-08T14:45:00'
      },
      {
        id: 'T-20013',
        title: 'IV cannula insertion',
        patientId: 'P-10048',
        patientName: 'Sarah Davis',
        roomNumber: 'ER-3',
        dueDate: '2025-03-08T17:30:00',
        priority: 'High',
        status: 'Completed',
        description: 'Insert new 18G IV cannula for fluid administration.',
        assignedBy: 'Dr. James Miller',
        assignedAt: '2025-03-08T16:20:00',
        completedAt: '2025-03-08T17:05:00',
        notes: 'Successfully placed in right forearm. Patient tolerated well.'
      },
      {
        id: 'T-20014',
        title: 'Assist with ambulation',
        patientId: 'P-10047',
        patientName: 'Robert Williams',
        roomNumber: '210B',
        dueDate: '2025-03-08T19:00:00',
        priority: 'Low',
        status: 'Assigned',
        description: 'Assist patient with walking in hallway for 10 minutes.',
        assignedBy: 'Dr. Michael Wong',
        assignedAt: '2025-03-08T15:30:00'
      },
      {
        id: 'T-20015',
        title: 'Administer PRN pain medication',
        patientId: 'P-10049',
        patientName: 'Michael Brown',
        roomNumber: '405C',
        dueDate: '2025-03-08T17:00:00',
        priority: 'Medium',
        status: 'Canceled',
        description: 'Administer morphine 2mg IV for breakthrough pain if pain score > 6/10.',
        assignedBy: 'Dr. Lisa Taylor',
        assignedAt: '2025-03-08T14:00:00',
        notes: 'Canceled as patient reported pain score of 3/10.'
      }
    ];
    
    setTasks(mockTasks);
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

  // Get urgency class
  const getUrgencyClass = (dueDate: string, priority: string): string => {
    const dueDateTime = new Date(dueDate);
    const diffInMs = dueDateTime.getTime() - currentDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInMs < 0) return 'text-red-600';
    if (priority === 'High' || diffInHours < 1) return 'text-red-600';
    if (priority === 'Medium' || diffInHours < 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Handle status change
  const handleStatusChange = (taskId: string, newStatus: Task['status']): void => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { 
          ...task, 
          status: newStatus 
        };
        
        if (newStatus === 'Completed') {
          updatedTask.completedAt = currentDate.toISOString();
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (statusFilter === 'active' && ['Completed', 'Canceled'].includes(task.status)) {
      return false;
    }
    if (statusFilter === 'completed' && task.status !== 'Completed') {
      return false;
    }
    if (statusFilter === 'canceled' && task.status !== 'Canceled') {
      return false;
    }
    
    // Filter by priority
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">My Tasks</h2>
        <div className="flex space-x-3">
          <Button
            variant={statusFilter === 'active' ? 'primary' : 'white'}
            size="sm"
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'primary' : 'white'}
            size="sm"
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </Button>
          <Button
            variant={statusFilter === 'canceled' ? 'primary' : 'white'}
            size="sm"
            onClick={() => setStatusFilter('canceled')}
          >
            Canceled
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">Filter by priority:</span>
          <select
            className="input-field py-1 text-sm"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
     
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <FilterIcon className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter === 'active' 
              ? "You don't have any active tasks."
              : statusFilter === 'completed'
                ? "You don't have any completed tasks."
                : "You don't have any canceled tasks."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id}>
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium">{task.title}</h3>
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
                    <span 
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        task.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : task.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : task.status === 'Canceled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700">{task.description}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:space-x-4">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Patient:</span> {task.patientName}
                      {task.roomNumber && ` (Room ${task.roomNumber})`}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Assigned by:</span> {task.assignedBy}
                    </p>
                  </div>
                  
                  {task.notes && (
                    <div className="bg-gray-50 p-2 rounded text-sm">
                      <span className="font-medium">Notes:</span> {task.notes}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end justify-between">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center mb-1">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span className={`text-sm font-medium ${getUrgencyClass(task.dueDate, task.priority)}`}>
                        {isTaskOverdue(task.dueDate) ? 'Overdue' : getTimeRemaining(task.dueDate)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Due: {formatDate(task.dueDate)}</div>
                    {task.completedAt && (
                      <div className="text-xs text-gray-500">Completed: {formatDate(task.completedAt)}</div>
                    )}
                  </div>
                  
                  {task.status !== 'Completed' && task.status !== 'Canceled' && (
                    <div className="flex space-x-2 mt-4">
                      {task.status === 'Assigned' && (
                        <Button
                          variant="white"
                          size="sm"
                          onClick={() => handleStatusChange(task.id, 'In Progress')}
                        >
                          Start Task
                        </Button>
                      )}
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<CheckCircleIcon className="h-4 w-4" />}
                        onClick={() => handleStatusChange(task.id, 'Completed')}
                      >
                        Complete
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<XCircleIcon className="h-4 w-4" />}
                        onClick={() => handleStatusChange(task.id, 'Canceled')}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
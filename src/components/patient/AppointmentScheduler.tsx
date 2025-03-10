import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  LocationMarkerIcon,
  XIcon
} from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  department: string;
  imageUrl?: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: number;
  doctorName: string;
  department: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'in-person' | 'telemedicine';
  reason?: string;
}

export default function AppointmentScheduler() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'telemedicine'>('in-person');
  const [appointmentReason, setAppointmentReason] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>('');
  const currentDate = new Date('2025-03-08 15:50:44');
  
  // Calculate minDate (today) and maxDate (3 months from now)
  const minDate = currentDate.toISOString().split('T')[0];
  const maxDate = new Date(currentDate);
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Mock data fetching
  useEffect(() => {
    // In a real app, these would be API calls
    const mockDoctors: Doctor[] = [
      {
        id: 101,
        name: 'Dr. Emily Johnson',
        specialty: 'General Medicine',
        department: 'Primary Care',
        imageUrl: '/images/doctor-emily.jpg'
      },
      {
        id: 102,
        name: 'Dr. David Chen',
        specialty: 'Cardiology',
        department: 'Cardiology',
        imageUrl: '/images/doctor-david.jpg'
      },
      {
        id: 103,
        name: 'Dr. Sarah Williams',
        specialty: 'Neurology',
        department: 'Neurology',
        imageUrl: '/images/doctor-sarah.jpg'
      },
      {
        id: 104,
        name: 'Dr. Michael Rodriguez',
        specialty: 'Pulmonology',
        department: 'Pulmonology',
        imageUrl: '/images/doctor-michael.jpg'
      },
      {
        id: 105,
        name: 'Dr. Lisa Thompson',
        specialty: 'Dermatology',
        department: 'Dermatology',
        imageUrl: '/images/doctor-lisa.jpg'
      }
    ];
    
    const mockAppointments: Appointment[] = [
      {
        id: 'APT-10045',
        patientId: 'P-10045',
        patientName: 'Youssef Harrabi',
        doctorId: 101,
        doctorName: 'Dr. Emily Johnson',
        department: 'Primary Care',
        specialty: 'General Medicine',
        date: '2025-03-15',
        time: '09:30',
        status: 'upcoming',
        type: 'in-person',
        reason: 'Annual physical examination'
      },
      {
        id: 'APT-10032',
        patientId: 'P-10045',
        patientName: 'Youssef Harrabi',
        doctorId: 104,
        doctorName: 'Dr. Michael Rodriguez',
        department: 'Pulmonology',
        specialty: 'Pulmonology',
        date: '2025-01-22',
        time: '14:00',
        status: 'completed',
        type: 'telemedicine',
        reason: 'Asthma follow-up'
      },
      {
        id: 'APT-9876',
        patientId: 'P-10045',
        patientName: 'Youssef Harrabi',
        doctorId: 102,
        doctorName: 'Dr. David Chen',
        department: 'Cardiology',
        specialty: 'Cardiology',
        date: '2024-11-05',
        time: '11:15',
        status: 'completed',
        type: 'in-person',
        reason: 'Heart palpitations'
      },
      {
        id: 'APT-9012',
        patientId: 'P-10045',
        patientName: 'Youssef Harrabi',
        doctorId: 105,
        doctorName: 'Dr. Lisa Thompson',
        department: 'Dermatology',
        specialty: 'Dermatology',
        date: '2024-12-18',
        time: '16:30',
        status: 'cancelled',
        type: 'in-person',
        reason: 'Skin rash consultation'
      }
    ];
    
    // Sort appointments by date
    mockAppointments.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });
    
    setDoctors(mockDoctors);
    setAppointments(mockAppointments);
    setIsLoading(false);
  }, []);

   // Reset form fields
   const resetFormFields = () => {
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTimeSlot('');
    setAppointmentType('in-person');
    setAppointmentReason('');
  };

  // Generate time slots for selected date and doctor
  const generateTimeSlots = () => {
    if (!selectedDoctor || !selectedDate) return;

    // In a real app, this would be an API call to get available slots
    // for the selected doctor on the selected date
    const times = [];
    const startHour = 8; // 8 AM
    const endHour = 17;  // 5 PM
    const interval = 30; // 30-minute intervals

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Randomly decide if slot is available (for demo purposes)
        // In a real app, this would come from the API
        const isAvailable = Math.random() > 0.3; // 70% chance of being available
        
        times.push({
          id: `${selectedDate}-${timeString}`,
          time: timeString,
          available: isAvailable
        });
      }
    }

    setTimeSlots(times);
  };

  // Effect to generate time slots when date or doctor changes
  useEffect(() => {
    generateTimeSlots();
  }, [selectedDate, selectedDoctor]);

  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedTimeSlot('');
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedTimeSlot('');
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };

  // Handle appointment submission
  const handleSubmitAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot) return;

    const selectedSlot = timeSlots.find(slot => slot.id === selectedTimeSlot);
    if (!selectedSlot) return;

    // Create new appointment
    const newAppointment: Appointment = {
      id: `APT-${Math.floor(10000 + Math.random() * 90000)}`, // Generate random ID
      patientId: 'P-10045', // Current user's ID
      patientName: 'Youssef Harrabi',
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      specialty: selectedDoctor.specialty,
      date: selectedDate,
      time: selectedSlot.time,
      status: 'upcoming',
      type: appointmentType,
      reason: appointmentReason
    };

    // Add to appointments list
    setAppointments([newAppointment, ...appointments]);
    
    // Close modal and show confirmation
    setIsModalOpen(false);
    setIsConfirmationModalOpen(true);
    resetFormFields();
  };

  // Open cancel appointment modal
  const handleCancelAppointmentClick = (appointmentId: string) => {
    setCancelAppointmentId(appointmentId);
    setIsCancelModalOpen(true);
  };

  // Confirm appointment cancellation
  const confirmCancelAppointment = () => {
    if (!cancelAppointmentId) return;

    setAppointments(appointments.map(apt => 
      apt.id === cancelAppointmentId 
        ? { ...apt, status: 'cancelled' } 
        : apt
    ));
    
    setIsCancelModalOpen(false);
    setCancelAppointmentId(null);
    setCancelReason('');
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format appointment datetime
  const formatAppointmentDateTime = (date: string, time: string): string => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Check if appointment is in the past
  const isAppointmentPast = (date: string, time: string): boolean => {
    const appointmentDate = new Date(`${date}T${time}`);
    return appointmentDate < new Date('2025-03-08 16:07:57');
  };

  // Filter appointments by status
  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const pastAppointments = appointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Appointments</h2>
        <Button
          variant="primary"
          icon={<CalendarIcon className="h-5 w-5" />}
          onClick={() => setIsModalOpen(true)}
        >
          Schedule Appointment
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading appointments...</div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <Card title="Upcoming Appointments">
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-full bg-primary-100">
                          <CalendarIcon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium">{apt.doctorName}</h3>
                          <p className="text-sm text-gray-500">{apt.specialty} • {apt.department}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <ClockIcon className="h-4 w-4 mr-1" /> 
                              {formatAppointmentDateTime(apt.date, apt.time)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <LocationMarkerIcon className="h-4 w-4 mr-1" /> 
                              {apt.type === 'in-person' ? 'In-Person Visit' : 'Telemedicine'}
                            </div>
                          </div>
                          {apt.reason && (
                            <p className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Reason:</span> {apt.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<XIcon className="h-4 w-4" />}
                        onClick={() => handleCancelAppointmentClick(apt.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No upcoming appointments.</p>
                <Button
                  variant="primary"
                  className="mt-3"
                  icon={<CalendarIcon className="h-5 w-5" />}
                  onClick={() => setIsModalOpen(true)}
                >
                  Schedule an Appointment
                </Button>
              </div>
            )}
          </Card>

          {/* Past Appointments */}
          <Card title="Past Appointments">
            {pastAppointments.length > 0 ? (
              <div className="space-y-4">
                {pastAppointments.map((apt) => (
                  <div 
                    key={apt.id} 
                    className={`border rounded-lg p-4 bg-white shadow-sm ${apt.status === 'cancelled' ? 'opacity-75' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${apt.status === 'completed' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {apt.status === 'completed' ? (
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                          ) : (
                            <XIcon className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-medium">{apt.doctorName}</h3>
                          <p className="text-sm text-gray-500">{apt.specialty} • {apt.department}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <ClockIcon className="h-4 w-4 mr-1" /> 
                              {formatAppointmentDateTime(apt.date, apt.time)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <LocationMarkerIcon className="h-4 w-4 mr-1" /> 
                              {apt.type === 'in-person' ? 'In-Person Visit' : 'Telemedicine'}
                            </div>
                          </div>
                          {apt.reason && (
                            <p className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Reason:</span> {apt.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        apt.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {apt.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No past appointments found.</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Schedule Appointment Modal */}
      <Modal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title="Schedule New Appointment"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a Doctor
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id} 
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedDoctor?.id === doctor.id ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                      {doctor.imageUrl ? (
                        <img src={doctor.imageUrl} alt={doctor.name} className="h-12 w-12 object-cover" />
                      ) : (
                        <UserIcon className="h-12 w-12 p-2 text-gray-500" />
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium text-gray-900">{doctor.name}</h3>
                      <p className="text-sm text-gray-500">{doctor.specialty}</p>
                      <p className="text-xs text-gray-500">{doctor.department}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedDoctor && (
            <>
              <div>
                <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  id="appointment-date"
                  className="input-field"
                  min={minDate}
                  max={maxDateStr}
                  value={selectedDate}
                  onChange={handleDateChange}
                  required
                />
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time Slot
                  </label>
                  {timeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!slot.available}
                          className={`px-2 py-2 text-sm rounded-md ${
                            selectedTimeSlot === slot.id
                              ? 'bg-primary-500 text-white'
                              : slot.available
                              ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          onClick={() => slot.available && handleTimeSlotSelect(slot.id)}
                        >
                          {slot.time}
                        </button>
                      ))}
                                       </div>
                  ) : (
                    <p className="text-sm text-gray-500">Loading available time slots...</p>
                  )}
                </div>
              )}

              {selectedTimeSlot && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Type
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-primary-600"
                          name="appointmentType"
                          value="in-person"
                          checked={appointmentType === 'in-person'}
                          onChange={() => setAppointmentType('in-person')}
                        />
                        <span className="ml-2 text-gray-700">In-Person Visit</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-primary-600"
                          name="appointmentType"
                          value="telemedicine"
                          checked={appointmentType === 'telemedicine'}
                          onChange={() => setAppointmentType('telemedicine')}
                        />
                        <span className="ml-2 text-gray-700">Telemedicine</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="appointment-reason" className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Visit
                    </label>
                    <textarea
                      id="appointment-reason"
                      className="input-field"
                      rows={3}
                      placeholder="Please briefly describe the reason for your visit"
                      value={appointmentReason}
                      onChange={(e) => setAppointmentReason(e.target.value)}
                    ></textarea>
                  </div>
                </>
              )}
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              variant="white"
              onClick={() => {
                setIsModalOpen(false);
                resetFormFields();
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleSubmitAppointment}
              disabled={!selectedDoctor || !selectedDate || !selectedTimeSlot}
            >
              Schedule Appointment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Appointment Modal */}
      <Modal
        open={isCancelModalOpen}
        setOpen={setIsCancelModalOpen}
        title="Cancel Appointment"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </p>
          <div>
            <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for cancellation (optional)
            </label>
            <textarea
              id="cancel-reason"
              className="input-field"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            ></textarea>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <Button 
              variant="white"
              onClick={() => {
                setIsCancelModalOpen(false);
                setCancelAppointmentId(null);
                setCancelReason('');
              }}
            >
              Keep Appointment
            </Button>
            <Button 
              variant="danger"
              onClick={confirmCancelAppointment}
            >
              Cancel Appointment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Appointment Confirmation Modal */}
      <Modal
        open={isConfirmationModalOpen}
        setOpen={setIsConfirmationModalOpen}
        size="sm"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <div className="mt-3">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Appointment Scheduled</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Your appointment has been successfully scheduled. You can view the details in your upcoming appointments.
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setIsConfirmationModalOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
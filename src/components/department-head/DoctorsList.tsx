import React, { useState, useEffect } from 'react';
import { UsersIcon, SearchIcon, SortAscendingIcon, PlusIcon, UserCircleIcon, MailIcon, PhoneIcon } from '@heroicons/react/outline';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  patients: number;
  rating: number;
  availability: string;
  availabilityColor?: string;
  email?: string;
  phone?: string;
  image?: string;
}

const DoctorsList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Doctor>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  


  // Enhanced mock data for doctors
  const mockDoctors: Doctor[] = [
    { 
      id: 1, 
      name: 'Dr. Sarah Chen', 
      specialty: 'Cardiology', 
      patients: 42, 
      rating: 4.8, 
      availability: 'Available',
      email: 'sarah.chen@healthcare.com',
      phone: '(555) 123-4567',
      image: 'https://randomuser.me/api/portraits/women/23.jpg'
    },
    { 
      id: 2, 
      name: 'Dr. Michael Rodriguez', 
      specialty: 'Neurology', 
      patients: 38, 
      rating: 4.7, 
      availability: 'In Surgery',
      email: 'michael.r@healthcare.com',
      phone: '(555) 234-5678',
      image: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    { 
      id: 3, 
      name: 'Dr. Emma Wilson', 
      specialty: 'Pediatrics', 
      patients: 56, 
      rating: 4.9, 
      availability: 'Available',
      email: 'emma.wilson@healthcare.com',
      phone: '(555) 345-6789',
      image: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    { 
      id: 4, 
      name: 'Dr. James Taylor', 
      specialty: 'Orthopedics', 
      patients: 31, 
      rating: 4.6, 
      availability: 'On Leave',
      email: 'james.taylor@healthcare.com',
      phone: '(555) 456-7890',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    { 
      id: 5, 
      name: 'Dr. Aisha Patel', 
      specialty: 'Dermatology', 
      patients: 45, 
      rating: 4.8, 
      availability: 'Available',
      email: 'aisha.patel@healthcare.com',
      phone: '(555) 567-8901',
      image: 'https://randomuser.me/api/portraits/women/67.jpg'
    },
    { 
      id: 6, 
      name: 'Dr. David Kim', 
      specialty: 'Ophthalmology', 
      patients: 27, 
      rating: 4.5, 
      availability: 'In Consultation',
      email: 'david.kim@healthcare.com',
      phone: '(555) 678-9012',
      image: 'https://randomuser.me/api/portraits/men/78.jpg'
    }
  ];

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      const processedDoctors = mockDoctors.map(doctor => ({
        ...doctor,
        availabilityColor: getAvailabilityColor(doctor.availability)
      }));
      setDoctors(processedDoctors);
      setLoading(false);
    }, 800);
  }, []);

  const getAvailabilityColor = (status: string): string => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'In Surgery':
      case 'In Consultation':
        return 'bg-yellow-100 text-yellow-800';
      case 'On Leave':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (column: keyof Doctor) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === 'name' || sortBy === 'specialty' || sortBy === 'availability') {
      const aValue = a[sortBy].toLowerCase();
      const bValue = b[sortBy].toLowerCase();
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    } else {
      // For numeric values
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (sortDirection === 'asc') {
        return (aValue as number) - (bValue as number);
      } else {
        return (bValue as number) - (aValue as number);
      }
    }
  });

  // Calculate doctor statistics
  const totalDoctors = doctors.length;
  const availableDoctors = doctors.filter(d => d.availability === 'Available').length;
  const unavailableDoctors = totalDoctors - availableDoctors;
  const averageRating = doctors.reduce((sum, doc) => sum + doc.rating, 0) / totalDoctors;

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Total Doctors</h3>
          <p className="text-3xl font-bold text-gray-900">{totalDoctors}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Available</h3>
          <p className="text-3xl font-bold text-gray-900">{availableDoctors}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">Unavailable</h3>
          <p className="text-3xl font-bold text-gray-900">{unavailableDoctors}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            <span className="ml-1 text-yellow-500 text-xl">★</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center">
              <UsersIcon className="h-5 w-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">
                Doctors in Your Department
              </h2>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {filteredDoctors.length} doctors
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search doctors..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Doctor
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No doctors found matching your search criteria.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortBy === 'name' && (
                        <SortAscendingIcon className={`h-4 w-4 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('specialty')}
                  >
                    <div className="flex items-center">
                      Specialty
                      {sortBy === 'specialty' && (
                        <SortAscendingIcon className={`h-4 w-4 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('patients')}
                  >
                    <div className="flex items-center">
                      Patients
                      {sortBy === 'patients' && (
                        <SortAscendingIcon className={`h-4 w-4 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('rating')}
                  >
                    <div className="flex items-center">
                      Rating
                      {sortBy === 'rating' && (
                        <SortAscendingIcon className={`h-4 w-4 ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('availability')}
                  >
                    <div className="flex items-center">
                      Availability
                      {sortBy === 'availability' && (
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
                {sortedDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {doctor.image ? (
                            <img className="h-10 w-10 rounded-full" src={doctor.image} alt={doctor.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserCircleIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                          <div className="text-xs text-gray-500">{doctor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.specialty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.patients}</div>
                      <div className="text-xs text-gray-500">Active cases</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                        <div className="ml-1 flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.round(doctor.rating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.availabilityColor}`}>
                        {doctor.availability}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                          <UserCircleIcon className="h-4 w-4 mr-1" />
                          Profile
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                          <MailIcon className="h-4 w-4 mr-1" />
                          Message
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      

    </div>
  );
};

export default DoctorsList;
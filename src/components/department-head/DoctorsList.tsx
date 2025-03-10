import React, { useState, useEffect } from 'react';
import { UsersIcon, SearchIcon, SortAscendingIcon } from '@heroicons/react/outline';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  patients: number;
  rating: number;
  availability: string;
  availabilityColor?: string;
}

const DoctorsList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Doctor>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Mock data for doctors
  const mockDoctors: Doctor[] = [
    { id: 1, name: 'Dr. Sarah Chen', specialty: 'Cardiology', patients: 42, rating: 4.8, availability: 'Available' },
    { id: 2, name: 'Dr. Michael Rodriguez', specialty: 'Neurology', patients: 38, rating: 4.7, availability: 'In Surgery' },
    { id: 3, name: 'Dr. Emma Wilson', specialty: 'Pediatrics', patients: 56, rating: 4.9, availability: 'Available' },
    { id: 4, name: 'Dr. James Taylor', specialty: 'Orthopedics', patients: 31, rating: 4.6, availability: 'On Leave' },
    { id: 5, name: 'Dr. Aisha Patel', specialty: 'Dermatology', patients: 45, rating: 4.8, availability: 'Available' },
    { id: 6, name: 'Dr. David Kim', specialty: 'Ophthalmology', patients: 27, rating: 4.5, availability: 'In Consultation' }
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            <UsersIcon className="inline h-5 w-5 mr-2 text-blue-600" />
            Doctors in Your Department
          </h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="loading-spinner mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading doctors...</p>
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
                    <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{doctor.specialty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{doctor.patients}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="font-medium">{doctor.rating}</span>
                        <span className="ml-1 text-yellow-500">★</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.availabilityColor}`}>
                      {doctor.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="btn-secondary btn-sm mr-2">View</button>
                    <button className="btn-primary btn-sm">Message</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
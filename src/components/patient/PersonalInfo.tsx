import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { PencilIcon, SaveIcon } from '@heroicons/react/solid';

interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bloodType: string;
  allergies: string[];
  medicalConditions: string[];
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
}

export default function PersonalInfo() {
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<PatientData | null>(null);

  // Mock data fetching
  useEffect(() => {
    // In a real app, this would be an API call
    const mockPatient: PatientData = {
      id: 'P-10045',
      firstName: 'Youssef',
      lastName: 'Harrabi',
      email: 'youssef.harrabi@example.com',
      phone: '(555) 123-4567',
      dateOfBirth: '1993-05-12',
      gender: 'Male',
      address: {
        street: '123 Health St',
        city: 'Tunis',
        state: 'TN',
        zip: '10001',
        country: 'Tunisia'
      },
      emergencyContact: {
        name: 'Amal Harrabi',
        relationship: 'Spouse',
        phone: '(555) 987-6543'
      },
      bloodType: 'O+',
      allergies: ['Penicillin', 'Peanuts'],
      medicalConditions: ['Asthma', 'Hypertension'],
      insurance: {
        provider: 'National Health Insurance',
        policyNumber: 'NHI-7890123',
        groupNumber: 'G-456789'
      }
    };
    
    setPatient(mockPatient);
    setEditData(mockPatient);
    setIsLoading(false);
  }, []);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date('2025-03-08 15:40:55');
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (!editData) return;

    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditData({
        ...editData,
        [parent]: {
          ...editData[parent as keyof PatientData] as Record<string, any>,
          [child]: value
        }
      });
    } else {
        setEditData({ ...editData, [name]: value });
      }
    };
  
    // Handle allergies and medical conditions as comma-separated values
    const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'allergies' | 'medicalConditions') => {
      if (!editData) return;
      
      const values = e.target.value.split(',').map(item => item.trim()).filter(item => item);
      setEditData({ ...editData, [field]: values });
    };
  
    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (editData) {
        setPatient(editData);
        setIsEditing(false);
      }
    };
  
    if (isLoading) {
      return <div className="text-center py-4">Loading...</div>;
    }
  
    if (!patient) {
      return <div className="text-center py-4">Patient information not found.</div>;
    }
  
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium text-gray-900">Personal Information</h2>
          {!isEditing ? (
            <Button
              variant="white"
              icon={<PencilIcon className="h-5 w-5" />}
              onClick={() => setIsEditing(true)}
            >
              Edit Information
            </Button>
          ) : (
            <Button
              variant="primary"
              icon={<SaveIcon className="h-5 w-5" />}
              onClick={() => handleSubmit}
            >
              Save Changes
            </Button>
          )}
        </div>
  
        {!isEditing ? (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="flex items-center pb-4 border-b">
                <div className="h-20 w-20 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-2xl font-bold">
                  {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-medium">{patient.firstName} {patient.lastName}</h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <div>Patient ID: {patient.id}</div>
                    <div>Age: {calculateAge(patient.dateOfBirth)} | Blood Type: {patient.bloodType}</div>
                  </div>
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="text-lg font-medium mb-4">Contact Information</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{patient.email}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{patient.phone}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {patient.address.street}<br />
                        {patient.address.city}, {patient.address.state} {patient.address.zip}<br />
                        {patient.address.country}
                      </dd>
                    </div>
                  </dl>
                </div>
  
                <div>
                  <h4 className="text-lg font-medium mb-4">Personal Details</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                      <dd className="mt-1 text-sm text-gray-900">{new Date(patient.dateOfBirth).toLocaleDateString()}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Gender</dt>
                      <dd className="mt-1 text-sm text-gray-900">{patient.gender}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {patient.emergencyContact.name} ({patient.emergencyContact.relationship})<br />
                        {patient.emergencyContact.phone}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </Card>
  
            <Card title="Medical Information">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2">
                <div className="md:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Blood Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{patient.bloodType}</dd>
                </div>
                <div className="md:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {patient.allergies.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {patient.allergies.map((allergy, index) => (
                          <li key={index}>{allergy}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500 italic">None reported</span>
                    )}
                  </dd>
                </div>
                <div className="md:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Medical Conditions</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {patient.medicalConditions.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {patient.medicalConditions.map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500 italic">None reported</span>
                    )}
                  </dd>
                </div>
                <div className="md:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Insurance</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <div>{patient.insurance.provider}</div>
                    <div>Policy #: {patient.insurance.policyNumber}</div>
                    <div>Group #: {patient.insurance.groupNumber}</div>
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {editData && (
              <>
                <Card title="Basic Information">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={editData.firstName}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={editData.lastName}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={editData.phone}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        id="dateOfBirth"
                        value={editData.dateOfBirth}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        name="gender"
                        id="gender"
                        value={editData.gender}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                        Blood Type
                      </label>
                      <select
                        name="bloodType"
                        id="bloodType"
                        value={editData.bloodType}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                </Card>
  
                <Card title="Address Information">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        id="address.street"
                        value={editData.address.street}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3 lg:col-span-2">
                      <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        id="address.city"
                        value={editData.address.city}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3 lg:col-span-2">
                      <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                        State / Province
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        id="address.state"
                        value={editData.address.state}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3 lg:col-span-2">
                      <label htmlFor="address.zip" className="block text-sm font-medium text-gray-700">
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        name="address.zip"
                        id="address.zip"
                        value={editData.address.zip}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        type="text"
                        name="address.country"
                        id="address.country"
                        value={editData.address.country}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        required
                      />
                    </div>
                  </div>
                </Card>
  
                <Card title="Emergency Contact">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="emergencyContact.name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.name"
                        id="emergencyContact.name"
                        value={editData.emergencyContact.name}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                    <label htmlFor="emergencyContact.relationship" className="block text-sm font-medium text-gray-700">
                      Relationship
                    </label>
                    <input
                      type="text"
                      name="emergencyContact.relationship"
                      id="emergencyContact.relationship"
                      value={editData.emergencyContact.relationship}
                      onChange={handleInputChange}
                      className="input-field mt-1"
                      required
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label htmlFor="emergencyContact.phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="emergencyContact.phone"
                      id="emergencyContact.phone"
                      value={editData.emergencyContact.phone}
                      onChange={handleInputChange}
                      className="input-field mt-1"
                      required
                    />
                  </div>
                </div>
              </Card>

              <Card title="Medical Information">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                      Allergies (separate with commas)
                    </label>
                    <textarea
                      id="allergies"
                      rows={3}
                      value={editData.allergies.join(', ')}
                      onChange={(e) => handleArrayChange(e, 'allergies')}
                      className="input-field mt-1"
                    ></textarea>
                  </div>
                  <div className="sm:col-span-6">
                    <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700">
                      Medical Conditions (separate with commas)
                    </label>
                    <textarea
                      id="medicalConditions"
                      rows={3}
                      value={editData.medicalConditions.join(', ')}
                      onChange={(e) => handleArrayChange(e, 'medicalConditions')}
                      className="input-field mt-1"
                    ></textarea>
                  </div>
                </div>
              </Card>

              <Card title="Insurance Information">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="insurance.provider" className="block text-sm font-medium text-gray-700">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      name="insurance.provider"
                      id="insurance.provider"
                      value={editData.insurance.provider}
                      onChange={handleInputChange}
                      className="input-field mt-1"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="insurance.policyNumber" className="block text-sm font-medium text-gray-700">
                      Policy Number
                    </label>
                    <input
                      type="text"
                      name="insurance.policyNumber"
                      id="insurance.policyNumber"
                      value={editData.insurance.policyNumber}
                      onChange={handleInputChange}
                      className="input-field mt-1"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="insurance.groupNumber" className="block text-sm font-medium text-gray-700">
                      Group Number
                    </label>
                    <input
                      type="text"
                      name="insurance.groupNumber"
                      id="insurance.groupNumber"
                      value={editData.insurance.groupNumber}
                      onChange={handleInputChange}
                      className="input-field mt-1"
                    />
                  </div>
                </div>
              </Card>

              <div className="flex justify-end space-x-3">
                <Button 
                  variant="white"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant="primary"
                  icon={<SaveIcon className="h-5 w-5" />}
                >
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}
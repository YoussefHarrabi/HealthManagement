import React, { useState, useRef } from 'react';
import { 
  UploadIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationCircleIcon,
  UserIcon,
  TagIcon,
  PhotographIcon,
  InformationCircleIcon
} from '@heroicons/react/outline';

interface UploadedImage {
  id: string;
  name: string;
  size: string;
  type: string;
  patientId?: string;
  patientName?: string;
  uploadDate: Date;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
}

const ImageUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [patientId, setPatientId] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setUploading(true);
    
    const newImages: UploadedImage[] = Array.from(files).map(file => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      patientId: patientId,
      patientName: patientName,
      uploadDate: new Date(),
      status: 'pending'
    }));
    
    setImages(prev => [...prev, ...newImages]);
    
    // Simulate upload process with random success/error
    setTimeout(() => {
      setUploading(false);
      setImages(prev => 
        prev.map(img => {
          if (img.status === 'pending') {
            const success = Math.random() > 0.2; // 80% success rate
            return {
              ...img,
              status: success ? 'success' : 'error',
              errorMessage: !success ? 'Failed to upload image. Please try again.' : undefined
            };
          }
          return img;
        })
      );
    }, 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <div className="loading-spinner h-5 w-5"></div>;
      default:
        return null;
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <PhotographIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Image Upload</h2>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="patientId" className="input-label">Patient ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="patientId"
                  type="text"
                  className="input-field pl-10"
                  placeholder="Enter patient ID"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="patientName" className="input-label">Patient Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="patientName"
                  type="text"
                  className="input-field pl-10"
                  placeholder="Enter patient name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center
              ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadIcon className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-2 text-base font-medium text-gray-900">
              Drag and drop medical image files here
            </p>
            <p className="mt-1 text-sm text-gray-500">
              or click to browse for files
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.dicom"
              className="hidden"
              onChange={handleChange}
            />
            <button
              type="button"
              className="mt-4 btn-primary btn-md"
              onClick={handleButtonClick}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Select Files'}
            </button>
            <p className="mt-2 text-xs text-gray-500">
              Supported formats: DICOM, JPEG, PNG, TIFF (max 50MB per file)
            </p>
          </div>
          
          {images.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900">Uploaded Images</h3>
                {images.some(img => img.status === 'error') && (
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => setImages(prev => prev.filter(img => img.status !== 'error'))}
                  >
                    Clear Failures
                  </button>
                )}
              </div>
              
              <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {images.map(img => (
                    <li key={img.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <span className="mr-3">
                          {getStatusIcon(img.status)}
                        </span>
                        <div className="truncate">
                          <p className="text-sm font-medium text-gray-900 truncate">{img.name}</p>
                          <p className="text-xs text-gray-500">
                            {img.size} • {new Date(img.uploadDate).toLocaleString()}
                          </p>
                          {img.status === 'error' && (
                            <p className="text-xs text-red-500 mt-1">
                              {img.errorMessage}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                          onClick={() => removeImage(img.id)}
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  type="button"
                  className="btn-white btn-md"
                  onClick={() => setImages([])}
                >
                  Clear All
                </button>
                <button
                  type="button"
                  className="btn-primary btn-md"
                  disabled={images.some(img => img.status === 'pending') || images.filter(img => img.status === 'success').length === 0}
                >
                  Process Images
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Upload Guidelines</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Ensure all patient information is correct before uploading</li>
                    <li>DICOM files must include patient metadata</li>
                    <li>Use high-resolution images when possible</li>
                    <li>Remove any personally identifiable information from non-DICOM images</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
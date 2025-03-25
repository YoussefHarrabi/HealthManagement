import axios from 'axios';

// Types for user authentication
export type UserRole = 'admin' | 'doctor' | 'patient' | 'nurse' | 'radiologist' | 'department_head';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
}

export interface LoginResponse {
  status: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
}

// Create axios instance for auth requests
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});

// Add authorization header with JWT token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ensure URL format is correct (Django typically expects trailing slashes)
    if (config.url && !config.url.endsWith('/') && !config.url.includes('?')) {
      config.url = `${config.url}/`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to extract error messages from Django DRF response
function extractErrorMessage(error: any): string {
  if (!error.response || !error.response.data) {
    return 'Network error. Please check your connection.';
  }

  const data = error.response.data;
  
  // Handle DRF's non_field_errors format
  if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
    return data.non_field_errors[0];
  }
  
  // Handle detail field from DRF
  if (data.detail) {
    return data.detail;
  }
  
  // Check if data has validation errors (field-specific errors)
  const fieldErrors: string[] = [];
  Object.entries(data).forEach(([field, errors]) => {
    if (field !== 'status' && field !== 'timestamp' && field !== 'user') {
      if (Array.isArray(errors)) {
        fieldErrors.push(`${field}: ${errors[0]}`);
      } else if (typeof errors === 'string') {
        fieldErrors.push(`${field}: ${errors}`);
      }
    }
  });
  
  if (fieldErrors.length > 0) {
    return fieldErrors.join('. ');
  }
  
  // Based on status codes
  if (error.response.status === 400) {
    return 'Bad request: Invalid data provided.';
  } else if (error.response.status === 401) {
    return 'Invalid email or password.';
  } else if (error.response.status === 403) {
    return 'You do not have permission to perform this action.';
  } else if (error.response.status === 404) {
    return 'Resource not found.';
  } else if (error.response.status === 500) {
    return 'Server error. Please try again later.';
  }
  
  return 'An error occurred. Please try again.';
}

// Auth service with methods for login, registration, etc.
const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/login', { email, password });
      
      // Store JWT tokens in localStorage
      localStorage.setItem('accessToken', response.data.tokens.access);
      localStorage.setItem('refreshToken', response.data.tokens.refresh);
      
      return response.data;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },
  
  register: async (data: RegisterData) => {
    try {
      const response = await api.post('/register', data);
      return response.data;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },
  
  logout: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('healthcareUser');
  },
  
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('healthcareUser');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },
  
  getRoles: async () => {
    try {
      const response = await api.get('/roles');
      return response.data;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },
  
  verifyToken: async (): Promise<boolean> => {
    try {
      await api.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }
};

export default AuthService;
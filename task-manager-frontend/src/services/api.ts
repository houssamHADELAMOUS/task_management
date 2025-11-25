import axios, { type AxiosInstance } from "axios";

// Define types
export interface User {
  id: number;
  name: string;
  email: string;
  role?: 'employee' | 'admin';
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  user_id: number | null;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'done';
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface TaskData {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'done';
  due_date?: string;
}

// FIX: Use the correct base URL (no /api at the end)
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false, // Changed to false since we use Bearer tokens, not cookies
});

// Add token to requests if it exists (optional - API is now public)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // No token required - all routes are public
  return config;
});

// FIX: Correct CSRF token endpoint
export const getCsrfToken = async (): Promise<void> => {
  try {
    await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true
    });
    console.log('CSRF token obtained successfully');
  } catch (error) {
    console.error('Failed to get CSRF token. Make sure Laravel server is running on:', API_BASE_URL);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: async (userData: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    const response = await api.post('/api/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return response.data;
  },

  getUser: async (): Promise<User> => {
    const response = await api.get('/api/user');
    return response.data;
  },

  getAllUsers: async (): Promise<{ users: User[] }> => {
    const response = await api.get('/api/users');
    return response.data;
  }
};

// Tasks API calls
export const tasksAPI = {
  getTasks: async (): Promise<{ tasks: Task[] }> => {
    const response = await api.get('/api/tasks');
    return response.data;
  },

  createTask: async (taskData: TaskData): Promise<{ task: Task }> => {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: number, taskData: Partial<TaskData>): Promise<{ task: Task }> => {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  },

  assignTask: async (taskId: number, userId: number): Promise<{ message: string; task: Task }> => {
    const response = await api.post(`/api/tasks/${taskId}/assign`, { user_id: userId });
    return response.data;
  }
};

export default api;
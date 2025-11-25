import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import './App.css';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';

// Define User type based on your Laravel User model
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// Form data types
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

// Task type
export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'done';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

// Auth Context Type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  isAuthenticated: boolean;
}

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Redirect root to tasks */}
          <Route path="/" element={<Navigate to="/tasks" />} />

          {/* Public routes - no authentication required */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/tasks" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
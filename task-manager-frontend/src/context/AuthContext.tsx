import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { authAPI } from '../services/api';
import type { User, AuthContextType, LoginCredentials, RegisterData } from '../App';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      setLoading(true);

      // Get a default user for public access (no auth required)
      const userData = await authAPI.getUser();
      setUser(userData);
      setError(null);
    } catch (error) {
      console.log('Using public access mode - no authentication required');
      // Set a default public user
      setUser({
        id: 1,
        name: 'Public User',
        email: 'public@example.com',
        email_verified_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      // Login user and get token
      const response = await authAPI.login(credentials);

      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));

      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Make sure the server is running.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      // Register user and get token
      const response = await authAPI.register(userData);

      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));

      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Make sure the server is running.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await authAPI.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null); // Clear user even if logout fails
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => setError(null);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
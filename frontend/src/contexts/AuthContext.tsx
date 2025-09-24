"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';

interface User {
  _id: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app start (but not on auth pages)
  useEffect(() => {
    // Don't check auth status if we're on auth pages or home page to prevent loops
    if (
      typeof window !== 'undefined' && (
        window.location.pathname === '/' || window.location.pathname.startsWith('/auth/')
      )
    ) {
      setIsLoading(false);
      return;
    }
    checkAuthStatus();
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      try {
        await authService.refreshToken();
        console.log('Token refreshed automatically');
      } catch (error) {
        console.error('Automatic token refresh failed:', error);
        // If refresh fails, logout user
        setUser(null);
        setIsAuthenticated(false);
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      console.log('Checking auth status...');
      const response = await authService.getCurrentUser();
      console.log('Auth check successful:', response.data);
      setUser(response.data.data.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.log('Auth check failed:', error.response?.status, error.response?.data);
      // Only try to refresh if it's an auth error, not a network error or other issue
      if (error.response?.status === 401) {
        try {
          console.log('Attempting token refresh...');
          await authService.refreshToken();
          const response = await authService.getCurrentUser();
          console.log('Token refresh successful');
          setUser(response.data.data.user);
          setIsAuthenticated(true);
        } catch (refreshError: any) {
          console.log('Token refresh failed:', refreshError.response?.status);
          // Refresh failed, user is not authenticated
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // For non-401 errors, just set as not authenticated
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await authService.login({ email, password });
      const response = await authService.getCurrentUser();
      setUser(response.data.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await authService.signUp({ email, password });
      const response = await authService.getCurrentUser();
      setUser(response.data.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshAuth = async () => {
    try {
      await authService.refreshToken();
      const response = await authService.getCurrentUser();
      setUser(response.data.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signUp,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
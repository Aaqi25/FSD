import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService, LoginCredentials, RegisterCredentials } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!authService.getCurrentUser());
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const result = await authService.login(credentials);
      setCurrentUser(result.user);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    try {
      const result = await authService.register(credentials);
      setCurrentUser(result.user);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

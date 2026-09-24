/**
 * Application Context: AuthContext
 * Maneja el estado global de autenticación, token y perfil de usuario en toda la app.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials, RegisterData } from '../../domain/entities/User';
import { authService } from '../../infrastructure/services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Al montar la app, verificamos si existe sesión activa
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session.isAuthenticated && session.user && session.token) {
          setUser(session.user);
          setToken(session.token);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch {
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const res = await authService.login(credentials);
    setUser(res.user);
    setToken(res.token);
  };

  const register = async (data: RegisterData) => {
    const res = await authService.register(data);
    setUser(res.user);
    setToken(res.token);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    try {
      const updatedUser = await authService.getProfile();
      setUser(updatedUser);
    } catch (error) {
      console.warn('Error al refrescar perfil:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

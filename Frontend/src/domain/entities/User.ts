/**
 * Domain Entity: User
 * Representa los tipos de negocio del dominio de autenticación.
 */

// === Entidad principal de usuario ===
export interface User {
  id: string;
  name: string;
  businessName: string;
  email: string;
  role: 'owner' | 'admin' | 'employee';
  createdAt: string;
  avatar?: string;
}

// === Credenciales para iniciar sesión ===
export interface LoginCredentials {
  email: string;
  password: string;
}

// === Datos para el registro ===
export interface RegisterData {
  name: string;
  businessName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// === Respuesta de autenticación ===
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// === Estado de sesión ===
export interface AuthSession {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

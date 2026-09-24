/**
 * Domain Entity: User
 * Representa los tipos de negocio del dominio de autenticación.
 */

// === Entidad de Negocio ===
export interface Negocio {
  id: number;
  nombre: string;
  actividad?: string;
  direccion?: string;
  dueno?: string;
  activo: boolean;
}

// === Entidad principal de usuario ===
export interface User {
  id: number | string;
  name: string;
  businessName: string;
  email: string;
  role: string;
  activo?: boolean;
  negocio_id?: number;
  createdAt?: string;
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
  email: string;
  password: string;
  confirmPassword?: string;
  negocio_id: number;
  codigo_negocio: string;
  businessName?: string;
}

// === Respuesta de autenticación del backend ===
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// === Estado de sesión ===
export interface AuthSession {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

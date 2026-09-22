/**
 * Infrastructure: Auth Service (Mock)
 * Adaptador mock que simula la capa de API.
 * En sprints futuros, este archivo será reemplazado por llamadas reales al Backend.
 */

import { AuthResponse, LoginCredentials, RegisterData, User } from '../../domain/entities/User';

// Simulated delay para emular latencia de red
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Usuario mock de prueba
const MOCK_USER: User = {
  id: 'usr_001',
  name: 'Samuel Molina',
  businessName: 'Negocio Demo SA',
  email: 'demo@negocio.com',
  role: 'owner',
  createdAt: new Date().toISOString(),
};

/**
 * Simula el login con credenciales.
 * Acepta cualquier email/password por ahora.
 * En producción: POST /api/auth/login
 */
export const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await delay(1000); // Simular latencia

  // Simular error si el password es "error"
  if (credentials.password === 'error') {
    throw new Error('Credenciales incorrectas. Por favor verifica tu correo y contraseña.');
  }

  return {
    user: { ...MOCK_USER, email: credentials.email },
    token: 'mock_access_token_' + Date.now(),
    refreshToken: 'mock_refresh_token_' + Date.now(),
  };
};

/**
 * Simula el registro de un nuevo usuario/negocio.
 * En producción: POST /api/auth/register
 */
export const mockRegister = async (data: RegisterData): Promise<AuthResponse> => {
  await delay(1200); // Simular latencia

  // Simular email ya registrado
  if (data.email === 'existente@test.com') {
    throw new Error('Este correo ya está registrado. Por favor inicia sesión.');
  }

  const newUser: User = {
    id: 'usr_' + Date.now(),
    name: data.name,
    businessName: data.businessName,
    email: data.email,
    role: 'owner',
    createdAt: new Date().toISOString(),
  };

  return {
    user: newUser,
    token: 'mock_access_token_' + Date.now(),
    refreshToken: 'mock_refresh_token_' + Date.now(),
  };
};

/**
 * Simula el logout.
 * En producción: POST /api/auth/logout
 */
export const mockLogout = async (): Promise<void> => {
  await delay(300);
};

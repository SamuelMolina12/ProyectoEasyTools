/**
 * Infrastructure Service: authService
 * Servicio real de autenticación conectado con los endpoints /api/auth de FastAPI.
 */

import { apiClient, storeToken, storeUser, clearStoredAuth, getStoredToken, getStoredUser } from './apiClient';
import { User, LoginCredentials, RegisterData, AuthResponse, AuthSession } from '../../domain/entities/User';

interface BackendUser {
  id: number;
  negocio_id: number;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
  negocio_nombre?: string;
}

interface BackendTokenResponse {
  access_token: string;
  token_type: string;
  user: BackendUser;
}

const mapBackendUserToUser = (bUser: BackendUser): User => {
  return {
    id: bUser.id,
    name: bUser.nombre,
    email: bUser.correo,
    businessName: bUser.negocio_nombre || 'Mi Negocio',
    role: bUser.rol,
    activo: bUser.activo,
    negocio_id: bUser.negocio_id,
  };
};

/**
 * Inicia sesión con correo y contraseña contra el Backend.
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const payload = {
    correo: credentials.email.trim().toLowerCase(),
    password: credentials.password,
  };

  const response = await apiClient.post<BackendTokenResponse>('/auth/login', payload);
  const user = mapBackendUserToUser(response.user);

  await storeToken(response.access_token);
  await storeUser(user);

  return {
    user,
    token: response.access_token,
  };
};

/**
 * Registra un nuevo usuario asociándolo a un negocio y validando su clave de acceso.
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const payload = {
    nombre: data.name.trim(),
    correo: data.email.trim().toLowerCase(),
    password: data.password,
    negocio_id: data.negocio_id,
    codigo_negocio: data.codigo_negocio.trim(),
  };

  const response = await apiClient.post<BackendTokenResponse>('/auth/register', payload);
  const user = mapBackendUserToUser(response.user);

  await storeToken(response.access_token);
  await storeUser(user);

  return {
    user,
    token: response.access_token,
  };
};

/**
 * Obtiene el perfil actual del usuario autenticado (/auth/me).
 */
export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<BackendUser>('/auth/me');
  const user = mapBackendUserToUser(response);
  await storeUser(user);
  return user;
};

/**
 * Cierra la sesión activa eliminando tokens locales.
 */
export const logout = async (): Promise<void> => {
  await clearStoredAuth();
};

/**
 * Verifica si existe una sesión activa y válida almacenada localmente.
 */
export const getCurrentSession = async (): Promise<AuthSession> => {
  try {
    const token = await getStoredToken();
    const storedUser = await getStoredUser();

    if (!token || !storedUser) {
      return {
        isAuthenticated: false,
        user: null,
        token: null,
      };
    }

    // Verificar token contra el backend si es posible
    try {
      const refreshedUser = await getProfile();
      return {
        isAuthenticated: true,
        user: refreshedUser,
        token,
      };
    } catch {
      // Si falla la validación del token con el backend (ej. token expirado), limpiar sesión
      await clearStoredAuth();
      return {
        isAuthenticated: false,
        user: null,
        token: null,
      };
    }
  } catch {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  }
};

export const authService = {
  login,
  register,
  getProfile,
  logout,
  getCurrentSession,
};

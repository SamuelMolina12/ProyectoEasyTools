/**
 * Infrastructure Service: apiClient
 * Cliente HTTP base para la comunicación con la API FastAPI de EasyTool.
 * Maneja tokens de sesión mediante AsyncStorage, configuración dinámica de URL y parsing de errores.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_KEY_TOKEN = '@easytool:access_token';
const STORAGE_KEY_USER = '@easytool:current_user';

// Determinar URL por defecto según plataforma
const getDefaultBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    // 10.0.2.2 es la IP especial del host en el emulador estándar de Android
    return 'http://10.0.2.2:8000/api';
  }
  // Web o iOS simulador
  return 'http://localhost:8000/api';
};

let currentBaseUrl = getDefaultBaseUrl();

export const setApiBaseUrl = (url: string) => {
  currentBaseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
};

export const getApiBaseUrl = (): string => {
  return currentBaseUrl;
};

export interface ApiResponse<T = any> {
  data: T;
  status: number;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Obtiene el token de acceso guardado en AsyncStorage
 */
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY_TOKEN);
  } catch {
    return null;
  }
};

/**
 * Guarda el token de acceso en AsyncStorage
 */
export const storeToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY_TOKEN, token);
};

/**
 * Elimina el token y usuario de AsyncStorage (Logout)
 */
export const clearStoredAuth = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
  await AsyncStorage.removeItem(STORAGE_KEY_USER);
};

/**
 * Guarda la información del usuario en AsyncStorage
 */
export const storeUser = async (user: any): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
};

/**
 * Obtiene el usuario guardado en AsyncStorage
 */
export const getStoredUser = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Método base para realizar peticiones HTTP
 */
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${currentBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = await getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err: any) {
    throw new ApiError(
      'No se pudo conectar con el servidor. Revisa tu conexión de red.',
      0,
      err
    );
  }

  // Manejo de respuesta vacía (ej. 204 No Content)
  if (response.status === 204) {
    return null as T;
  }

  let responseData: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    let errorMessage = 'Error en la solicitud';
    if (responseData) {
      if (typeof responseData.detail === 'string') {
        errorMessage = responseData.detail;
      } else if (Array.isArray(responseData.detail)) {
        // Errores de validación Pydantic
        errorMessage = responseData.detail.map((d: any) => d.msg || d.message).join(', ');
      } else if (responseData.message) {
        errorMessage = responseData.message;
      }
    }
    throw new ApiError(errorMessage, response.status, responseData);
  }

  return responseData as T;
}

export const apiClient = {
  get: <T = any>(endpoint: string, params?: Record<string, any>) => {
    let url = endpoint;
    if (params) {
      const queryParts: string[] = [];
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
        }
      });
      if (queryParts.length > 0) {
        url += (url.includes('?') ? '&' : '?') + queryParts.join('&');
      }
    }
    return request<T>(url, { method: 'GET' });
  },

  post: <T = any>(endpoint: string, body?: any) => {
    return request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put: <T = any>(endpoint: string, body?: any) => {
    return request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete: <T = any>(endpoint: string) => {
    return request<T>(endpoint, { method: 'DELETE' });
  },
};

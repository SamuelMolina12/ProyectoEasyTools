/**
 * Application Layer: useAuthForm Hook
 * Encapsula la lógica de validación y estado de los formularios de autenticación.
 * Sigue el patrón de casos de uso de la arquitectura hexagonal.
 */

import { useState } from 'react';
import { LoginCredentials, RegisterData } from '../../domain/entities/User';

// === Tipos de errores por campo ===
export interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface RegisterErrors {
  name?: string;
  businessName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// ============================================================
// Hook para el formulario de Login
// ============================================================
export const useLoginForm = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field: keyof LoginCredentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!credentials.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!credentials.password) {
      newErrors.password = 'La contraseña es requerida.';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetErrors = () => setErrors({});

  return {
    credentials,
    errors,
    isLoading,
    showPassword,
    setIsLoading,
    setErrors,
    updateField,
    validate,
    resetErrors,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
  };
};

// ============================================================
// Hook para el formulario de Registro
// ============================================================
export const useRegisterForm = () => {
  const [data, setData] = useState<RegisterData>({
    name: '',
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (field: keyof RegisterData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: RegisterErrors = {};

    if (!data.name.trim()) {
      newErrors.name = 'Tu nombre es requerido.';
    } else if (data.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres.';
    }

    if (!data.businessName.trim()) {
      newErrors.businessName = 'El nombre del negocio es requerido.';
    }

    if (!data.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!data.password) {
      newErrors.password = 'La contraseña es requerida.';
    } else if (data.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña.';
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetErrors = () => setErrors({});

  return {
    data,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,
    setIsLoading,
    setErrors,
    updateField,
    validate,
    resetErrors,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
    toggleShowConfirmPassword: () => setShowConfirmPassword((prev) => !prev),
  };
};

/**
 * Infrastructure Service: adminService
 * Conexión con los endpoints /api/admin para el Super Administrador
 */
import { apiClient } from './apiClient';

export interface NegocioDetalle {
  id: number;
  nombre: string;
  telefono?: string;
  actividad?: string;
  direccion?: string;
  dueno?: string;
  correo?: string;
  activo: boolean;
  fecha_creacion: string;
  total_usuarios: number;
}

export interface UsuarioAdmin {
  id: number;
  negocio_id?: number;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
  fecha_creacion: string;
  negocio_nombre?: string;
}

export const adminService = {
  getNegocios: async (): Promise<NegocioDetalle[]> => {
    return await apiClient.get<NegocioDetalle[]>('/admin/negocios');
  },
  
  createNegocio: async (data: { nombre: string, actividad?: string, codigo_acceso: string }): Promise<NegocioDetalle> => {
    return await apiClient.post<NegocioDetalle>('/admin/negocios', data);
  },
  
  toggleNegocio: async (id: number): Promise<NegocioDetalle> => {
    return await apiClient.patch<NegocioDetalle>(`/admin/negocios/${id}/toggle`, {});
  },

  getUsuariosPorNegocio: async (negocioId: number): Promise<UsuarioAdmin[]> => {
    return await apiClient.get<UsuarioAdmin[]>(`/admin/negocios/${negocioId}/usuarios`);
  },

  updateUsuario: async (id: number, data: { rol?: string; activo?: boolean }): Promise<UsuarioAdmin> => {
    return await apiClient.put<UsuarioAdmin>(`/admin/usuarios/${id}`, data);
  }
};

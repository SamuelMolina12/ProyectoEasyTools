/**
 * Infrastructure Service: clienteService
 */
import { apiClient } from './apiClient';
import { Cliente, CreateClienteData } from '../../domain/entities/Cliente';

export const getClientes = async (search?: string): Promise<Cliente[]> => {
  const params: Record<string, any> = {};
  if (search && search.trim()) params.search = search.trim();
  return await apiClient.get<Cliente[]>('/clientes', params);
};

export const getClienteById = async (id: number): Promise<Cliente> => {
  return await apiClient.get<Cliente>(`/clientes/${id}`);
};

export const createCliente = async (data: CreateClienteData): Promise<Cliente> => {
  return await apiClient.post<Cliente>('/clientes', data);
};

export const updateCliente = async (id: number, data: Partial<CreateClienteData> & { activo?: boolean }): Promise<Cliente> => {
  return await apiClient.put<Cliente>(`/clientes/${id}`, data);
};

export const deleteCliente = async (id: number): Promise<void> => {
  await apiClient.delete(`/clientes/${id}`);
};

export const clienteService = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
};

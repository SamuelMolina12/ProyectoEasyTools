/**
 * Infrastructure Service: negocioService
 * Maneja llamadas a la API de Negocios de EasyTool.
 */

import { apiClient } from './apiClient';
import { Negocio } from '../../domain/entities/User';

export const getNegocios = async (): Promise<Negocio[]> => {
  return await apiClient.get<Negocio[]>('/negocios');
};

export const negocioService = {
  getNegocios,
};

/**
 * Infrastructure Service: ventaService
 * Conectado a los endpoints /api/ventas de FastAPI.
 */

import { apiClient } from './apiClient';
import { Sale, CreateSaleData } from '../../domain/entities/Sale';

interface BackendSaleDetail {
  id: number;
  producto_id: number;
  producto_nombre?: string;
  cantidad: number;
  precio_unitario: string | number;
  subtotal: string | number;
}

interface BackendSale {
  id: number;
  negocio_id: number;
  usuario_id: number;
  cliente_id?: number | null;
  total: string | number;
  estado: string;
  fecha_venta: string;
  detalles: BackendSaleDetail[];
}

interface BackendSaleListResponse {
  items: BackendSale[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const mapSale = (s: BackendSale): Sale => ({
  id: s.id,
  negocio_id: s.negocio_id,
  usuario_id: s.usuario_id,
  cliente_id: s.cliente_id ?? null,
  total: typeof s.total === 'string' ? parseFloat(s.total) : Number(s.total),
  estado: s.estado,
  fecha_venta: s.fecha_venta,
  detalles: s.detalles.map((d) => ({
    id: d.id,
    producto_id: d.producto_id,
    producto_nombre: d.producto_nombre,
    cantidad: d.cantidad,
    precio_unitario: typeof d.precio_unitario === 'string' ? parseFloat(d.precio_unitario) : Number(d.precio_unitario),
    subtotal: typeof d.subtotal === 'string' ? parseFloat(d.subtotal) : Number(d.subtotal),
  })),
});

export const createVenta = async (data: CreateSaleData): Promise<Sale> => {
  const response = await apiClient.post<BackendSale>('/ventas', data);
  return mapSale(response);
};

export const getVentas = async (
  page = 1,
  pageSize = 20,
): Promise<{ sales: Sale[]; total: number; pages: number }> => {
  const response = await apiClient.get<BackendSaleListResponse>('/ventas', { page, pageSize });
  return {
    sales: response.items.map(mapSale),
    total: response.total,
    pages: response.totalPages,
  };
};

export const getVentaById = async (id: number): Promise<Sale> => {
  const response = await apiClient.get<BackendSale>(`/ventas/${id}`);
  return mapSale(response);
};

export const formatCurrency = (value: number): string =>
  `$${Number(value).toLocaleString('es-CO')}`;

export const ventaService = {
  createVenta,
  getVentas,
  getVentaById,
  formatCurrency,
};

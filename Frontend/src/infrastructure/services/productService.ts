/**
 * Infrastructure Service: productService
 * Servicio real de catálogo de productos conectado a los endpoints /api/products de FastAPI.
 */

import { apiClient } from './apiClient';
import { Product, CreateProductData } from '../../domain/entities/Product';

interface BackendProduct {
  id: number;
  negocio_id: number;
  nombre: string;
  descripcion?: string | null;
  categoria: string;
  precio: number | string;
  stock: number;
  stock_minimo: number;
  activo: boolean;
  fecha_creacion: string;
}

interface BackendProductListResponse {
  items: BackendProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const mapBackendProductToProduct = (item: BackendProduct): Product => {
  return {
    id: String(item.id),
    name: item.nombre,
    price: typeof item.precio === 'string' ? parseFloat(item.precio) : Number(item.precio),
    category: item.categoria,
    stock: item.stock,
    minStock: item.stock_minimo,
    description: item.descripcion || '',
    isActive: item.activo,
    createdAt: item.fecha_creacion,
    updatedAt: item.fecha_creacion,
  };
};

/**
 * Obtiene la lista paginada de productos con filtros de búsqueda y categoría.
 */
export const getProducts = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  category?: string
): Promise<{ products: Product[]; total: number; pages: number; page: number }> => {
  const params: Record<string, any> = {
    page,
    pageSize,
  };

  if (search && search.trim().length > 0) {
    params.search = search.trim();
  }

  if (category && category !== 'all') {
    params.category = category;
  }

  const response = await apiClient.get<BackendProductListResponse>('/products', params);

  return {
    products: response.items.map(mapBackendProductToProduct),
    total: response.total,
    pages: response.totalPages,
    page: response.page,
  };
};

/**
 * Registra un nuevo producto en el catálogo del negocio.
 */
export const createProduct = async (data: CreateProductData): Promise<Product> => {
  const payload = {
    nombre: data.name.trim(),
    descripcion: data.description ? data.description.trim() : null,
    categoria: data.category,
    precio: parseFloat(data.price),
    stock: parseInt(data.stock, 10),
    stock_minimo: data.minStock ? parseInt(data.minStock, 10) : 5,
  };

  const response = await apiClient.post<BackendProduct>('/products', payload);
  return mapBackendProductToProduct(response);
};

/**
 * Obtiene el detalle de un producto por su identificador.
 */
export const getProductById = async (id: string | number): Promise<Product> => {
  const response = await apiClient.get<BackendProduct>(`/products/${id}`);
  return mapBackendProductToProduct(response);
};

/**
 * Actualiza la información de un producto.
 */
export const updateProduct = async (
  id: string | number,
  data: Partial<CreateProductData> & { isActive?: boolean }
): Promise<Product> => {
  const payload: Record<string, any> = {};

  if (data.name !== undefined) payload.nombre = data.name.trim();
  if (data.description !== undefined) payload.descripcion = data.description.trim() || null;
  if (data.category !== undefined) payload.categoria = data.category;
  if (data.price !== undefined) payload.precio = parseFloat(data.price);
  if (data.stock !== undefined) payload.stock = parseInt(data.stock, 10);
  if (data.minStock !== undefined) payload.stock_minimo = parseInt(data.minStock, 10);
  if (data.isActive !== undefined) payload.activo = data.isActive;

  const response = await apiClient.put<BackendProduct>(`/products/${id}`, payload);
  return mapBackendProductToProduct(response);
};

/**
 * Elimina (desactiva) un producto del catálogo.
 */
export const deleteProduct = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};

/**
 * Formatea un valor numérico a moneda colombiana (COP).
 */
export const formatPrice = (price: number): string => {
  return `$${Number(price).toLocaleString('es-CO')}`;
};

/**
 * Determina si un producto tiene stock bajo (<= stock_minimo o por defecto <= 5).
 */
export const isLowStock = (product: Product): boolean => {
  const threshold = product.minStock !== undefined ? product.minStock : 5;
  return product.stock <= threshold;
};

export const productService = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  formatPrice,
  isLowStock,
};


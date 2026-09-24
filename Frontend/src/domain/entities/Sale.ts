/**
 * Domain Entity: Sale
 * Representa los tipos del dominio de ventas.
 */

export interface SaleItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface SaleDetail {
  id: number;
  producto_id: number;
  producto_nombre?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  negocio_id: number;
  usuario_id: number;
  cliente_id?: number | null;
  total: number;
  estado: string;
  fecha_venta: string;
  detalles: SaleDetail[];
}

export interface CreateSaleData {
  detalles: { producto_id: number; cantidad: number }[];
  cliente_id?: number | null;
}

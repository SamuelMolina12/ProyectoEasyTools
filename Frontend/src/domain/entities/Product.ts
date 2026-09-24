/**
 * Domain Entity: Product
 * Representa los tipos de negocio del dominio de productos.
 */

// === Categorías disponibles ===
export type ProductCategory =
  | 'alimentos'
  | 'bebidas'
  | 'limpieza'
  | 'papelería'
  | 'electrónica'
  | 'ropa'
  | 'hogar'
  | 'salud'
  | 'otro';

export const PRODUCT_CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: 'Alimentos', value: 'alimentos' },
  { label: 'Bebidas', value: 'bebidas' },
  { label: 'Limpieza', value: 'limpieza' },
  { label: 'Papelería', value: 'papelería' },
  { label: 'Electrónica', value: 'electrónica' },
  { label: 'Ropa', value: 'ropa' },
  { label: 'Hogar', value: 'hogar' },
  { label: 'Salud', value: 'salud' },
  { label: 'Otro', value: 'otro' },
];

// === Entidad principal de producto (Frontend) ===
export interface Product {
  id: string;
  name: string;
  price: number;           // Precio unitario en COP
  category: ProductCategory | string;
  stock: number;           // Unidades disponibles
  minStock?: number;       // Stock mínimo
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// === Datos del formulario de creación ===
export interface CreateProductData {
  name: string;
  price: string;          // String para capturar del input, se convierte a number al guardar
  category: ProductCategory | '';
  stock: string;
  minStock?: string;
  description: string;
}

// === Errores de validación del formulario ===
export interface ProductFormErrors {
  name?: string;
  price?: string;
  category?: string;
  stock?: string;
  minStock?: string;
  description?: string;
  general?: string;
}

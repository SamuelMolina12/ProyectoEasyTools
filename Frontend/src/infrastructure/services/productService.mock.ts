/**
 * Infrastructure: Product Service (Mock)
 * Simula las operaciones CRUD de productos.
 * En sprints futuros se reemplazará por llamadas reales al Backend.
 */

import {
  CreateProductData,
  Product,
  ProductCategory,
} from '../../domain/entities/Product';

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Base de datos en memoria (se reinicia al cerrar la app)
let MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    name: 'Café Sello Rojo 500g',
    price: 12500,
    category: 'alimentos',
    stock: 95,
    description: 'Café molido premium 500 gramos',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_002',
    name: 'Leche Entera 1L',
    price: 3800,
    category: 'alimentos',
    stock: 220,
    description: 'Leche entera bolsa 1 litro',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_003',
    name: 'Agua Cristal 600ml',
    price: 1500,
    category: 'bebidas',
    stock: 48,
    description: 'Agua mineral 600 ml',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_004',
    name: 'Jabón Axe Sport',
    price: 5200,
    category: 'limpieza',
    stock: 34,
    description: 'Jabón corporal 265g',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_005',
    name: 'Cuaderno Norma 100 Hojas',
    price: 8900,
    category: 'papelería',
    stock: 60,
    description: 'Cuaderno cuadriculado argollado',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_006',
    name: 'Gaseosa Coca-Cola 1.5L',
    price: 7200,
    category: 'bebidas',
    stock: 8,   // Stock bajo — para demo de alerta visual
    description: 'Gaseosa 1.5 litros',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Umbral para alerta de stock bajo
const LOW_STOCK_THRESHOLD = 10;

/**
 * Obtiene todos los productos activos paginados.
 * En producción: GET /api/products?page=&limit=
 */
export const mockGetProducts = async (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  category: ProductCategory | 'all' = 'all',
): Promise<{ products: Product[]; total: number; pages: number }> => {
  await delay(500);

  let filtered = MOCK_PRODUCTS.filter((p) => p.isActive);

  // Filtro de búsqueda
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  // Filtro por categoría
  if (category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }

  const total = filtered.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const products = filtered.slice(start, start + limit);

  return { products, total, pages };
};

/**
 * Crea un nuevo producto.
 * En producción: POST /api/products
 */
export const mockCreateProduct = async (
  data: CreateProductData,
): Promise<Product> => {
  await delay(800);

  // Simular nombre duplicado
  const exists = MOCK_PRODUCTS.some(
    (p) => p.name.toLowerCase() === data.name.toLowerCase().trim(),
  );
  if (exists) {
    throw new Error(
      'Ya existe un producto con ese nombre. Por favor usa un nombre diferente.',
    );
  }

  const newProduct: Product = {
    id: 'prod_' + Date.now(),
    name: data.name.trim(),
    price: parseFloat(data.price.replace(/,/g, '')),
    category: data.category as ProductCategory,
    stock: parseInt(data.stock, 10),
    description: data.description.trim() || undefined,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  MOCK_PRODUCTS.unshift(newProduct); // Insertar al inicio
  return newProduct;
};

/**
 * Helper: determina si un producto tiene stock bajo.
 */
export const isLowStock = (product: Product): boolean =>
  product.stock <= LOW_STOCK_THRESHOLD;

/**
 * Formatea el precio en formato COP.
 */
export const formatPrice = (price: number): string =>
  `$${price.toLocaleString('es-CO')}`;

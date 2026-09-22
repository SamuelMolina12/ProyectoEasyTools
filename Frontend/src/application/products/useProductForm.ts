/**
 * Application Layer: useProductForm Hook
 * Encapsula validación y estado del formulario de creación/edición de productos.
 */

import { useState } from 'react';
import {
  CreateProductData,
  ProductCategory,
  ProductFormErrors,
} from '../../domain/entities/Product';

const INITIAL_STATE: CreateProductData = {
  name: '',
  price: '',
  category: '',
  stock: '',
  description: '',
};

export const useProductForm = (initial?: Partial<CreateProductData>) => {
  const [data, setData] = useState<CreateProductData>({
    ...INITIAL_STATE,
    ...initial,
  });
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof CreateProductData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const setCategory = (category: ProductCategory | '') => {
    setData((prev) => ({ ...prev, category }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: ProductFormErrors = {};

    // Nombre
    if (!data.name.trim()) {
      newErrors.name = 'El nombre del producto es requerido.';
    } else if (data.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres.';
    } else if (data.name.trim().length > 100) {
      newErrors.name = 'El nombre no puede superar 100 caracteres.';
    }

    // Precio
    if (!data.price.trim()) {
      newErrors.price = 'El precio es requerido.';
    } else {
      const priceNum = parseFloat(data.price.replace(/,/g, ''));
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = 'Ingresa un precio válido mayor a cero.';
      }
    }

    // Categoría
    if (!data.category) {
      newErrors.category = 'Selecciona una categoría.';
    }

    // Stock
    if (!data.stock.trim()) {
      newErrors.stock = 'El stock inicial es requerido.';
    } else {
      const stockNum = parseInt(data.stock, 10);
      if (isNaN(stockNum) || stockNum < 0) {
        newErrors.stock = 'Ingresa un stock válido (mínimo 0).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setData(INITIAL_STATE);
    setErrors({});
  };

  return {
    data,
    errors,
    isLoading,
    setIsLoading,
    setErrors,
    updateField,
    setCategory,
    validate,
    reset,
  };
};

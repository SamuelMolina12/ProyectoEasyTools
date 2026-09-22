/**
 * Navigation: ProductsNavigator
 * Stack Navigator para el módulo de Productos: Lista → Formulario
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductListScreen } from '../screens/products/ProductListScreen';
import { ProductFormScreen } from '../screens/products/ProductFormScreen';

export type ProductsStackParamList = {
  ProductList: undefined;
  ProductForm: undefined;
};

const Stack = createNativeStackNavigator<ProductsStackParamList>();

export const ProductsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f0f4f8' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductForm" component={ProductFormScreen} />
    </Stack.Navigator>
  );
};

export default ProductsNavigator;

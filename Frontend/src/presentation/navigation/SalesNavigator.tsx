/**
 * Navigation: SalesNavigator
 * Stack Navigator para el módulo de Ventas: Historial → Nueva Venta
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SalesHistoryScreen } from '../screens/sales/SalesHistoryScreen';
import { NewSaleScreen } from '../screens/sales/NewSaleScreen';

export type SalesStackParamList = {
  SalesHistory: undefined;
  NewSale: undefined;
};

const Stack = createNativeStackNavigator<SalesStackParamList>();

export const SalesNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f0f4f8' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="SalesHistory" component={SalesHistoryScreen} />
      <Stack.Screen name="NewSale" component={NewSaleScreen} />
    </Stack.Navigator>
  );
};

export default SalesNavigator;

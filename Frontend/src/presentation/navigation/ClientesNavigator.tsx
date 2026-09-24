/**
 * Navigation: ClientesNavigator
 * Stack Navigator para el módulo de Clientes
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClientesScreen } from '../screens/clients/ClientesScreen';
import { ClienteFormScreen } from '../screens/clients/ClienteFormScreen';

export type ClientesStackParamList = {
  ClientesList: undefined;
  ClienteForm: { clienteId?: number };
};

const Stack = createNativeStackNavigator<ClientesStackParamList>();

export const ClientesNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f0f4f8' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ClientesList" component={ClientesScreen} />
      <Stack.Screen name="ClienteForm" component={ClienteFormScreen} />
    </Stack.Navigator>
  );
};

export default ClientesNavigator;

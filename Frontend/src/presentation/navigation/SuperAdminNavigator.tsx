/**
 * Navigation: SuperAdminNavigator
 * Stack Navigator para el panel exclusivo del SuperAdmin
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminDashboardScreen } from '../screens/superadmin/AdminDashboardScreen';
import { AdminNegociosScreen } from '../screens/superadmin/AdminNegociosScreen';
import { AdminNegocioFormScreen } from '../screens/superadmin/AdminNegocioFormScreen';

export type SuperAdminStackParamList = {
  AdminDashboard: undefined;
  AdminNegocios: undefined;
  AdminNegocioForm: undefined;
};

const Stack = createNativeStackNavigator<SuperAdminStackParamList>();

export const SuperAdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f0f4f8' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminNegocios" component={AdminNegociosScreen} />
      <Stack.Screen name="AdminNegocioForm" component={AdminNegocioFormScreen} />
    </Stack.Navigator>
  );
};

export default SuperAdminNavigator;

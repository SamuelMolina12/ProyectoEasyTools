/**
 * Navigation: AppNavigator
 * Raíz de la navegación — decide entre Auth y Main según estado real de sesión.
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { SuperAdminNavigator } from './SuperAdminNavigator';
import { useAuth } from '../../application/auth/AuthContext';

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00c9a7" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        user?.role === 'superadmin' ? (
          <SuperAdminNavigator />
        ) : (
          <MainNavigator />
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppNavigator;

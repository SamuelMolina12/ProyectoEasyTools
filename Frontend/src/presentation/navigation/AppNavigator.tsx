/**
 * Navigation: AppNavigator
 * Raíz de la navegación — decide entre Auth y Main según estado de sesión.
 */

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export const AppNavigator: React.FC = () => {
  // Estado de autenticación local — en Sprint 2+ se reemplazará por Context o Zustand
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainNavigator />
      ) : (
        <AuthNavigator
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;

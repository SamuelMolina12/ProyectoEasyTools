/**
 * Navigation: AuthNavigator
 * Stack Navigator para el flujo de autenticación: Login ↔ Register
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

// Tipos del stack de autenticación
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface AuthNavigatorProps {
  onLoginSuccess?: () => void;
  onRegisterSuccess?: () => void;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({
  onLoginSuccess,
  onRegisterSuccess,
}) => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#f0f4f8' },
      }}
    >
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => (
          <RegisterScreen {...props} onRegisterSuccess={onRegisterSuccess} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;

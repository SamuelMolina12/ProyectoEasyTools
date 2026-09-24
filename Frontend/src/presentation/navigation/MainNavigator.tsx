/**
 * Navigation: MainNavigator
 * Tab Navigator principal — Dashboard + Productos (Sprint 1).
 * Se irán agregando tabs en sprints posteriores: Ventas, Inventario, Reportes.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ProductsNavigator } from './ProductsNavigator';
import { SalesNavigator } from './SalesNavigator';
import { ClientesNavigator } from './ClientesNavigator';

export type MainTabParamList = {
  Dashboard: undefined;
  Productos: undefined;
  Ventas: undefined;
  Clientes: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ emoji, label, focused }) => (
  <View style={tabStyles.iconWrapper}>
    <Text style={[tabStyles.emoji, focused && tabStyles.emojiFocused]}>{emoji}</Text>
    <Text style={[tabStyles.label, focused && tabStyles.labelFocused]}>{label}</Text>
  </View>
);

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: tabStyles.tabBar,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon emoji="📊" label="Inicio" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Productos"
        component={ProductsNavigator}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon emoji="📦" label="Catálogo" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Ventas"
        component={SalesNavigator}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon emoji="🛒" label="Ventas" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Clientes"
        component={ClientesNavigator}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon emoji="👥" label="Clientes" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    height: 70,
    paddingTop: 8,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  emoji: {
    fontSize: 22,
    opacity: 0.45,
  },
  emojiFocused: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
  },
  labelFocused: {
    color: '#00c9a7',
  },
});

export default MainNavigator;


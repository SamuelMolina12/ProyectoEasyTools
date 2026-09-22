/**
 * UI Component: Card
 * Contenedor con sombra y bordes redondeados. Variantes con gradiente.
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
  padding = 20,
}) => {
  return (
    <View style={[styles.base, styles[variant], { padding }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  flat: {
    backgroundColor: '#f8fafc',
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default Card;

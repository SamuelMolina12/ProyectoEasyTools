/**
 * UI Component: Logo
 * Identidad visual del proyecto — nombre y símbolo.
 */

import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  animate?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  animate = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(animate ? 0.5 : 1)).current;
  const opacityAnim = useRef(new Animated.Value(animate ? 0 : 1)).current;

  useEffect(() => {
    if (animate) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 10,
          speed: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animate]);

  const config = {
    sm: { iconSize: 36, iconFont: 18, nameFont: 18, taglineFont: 11 },
    md: { iconSize: 52, iconFont: 26, nameFont: 26, taglineFont: 13 },
    lg: { iconSize: 72, iconFont: 36, nameFont: 32, taglineFont: 15 },
  }[size];

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
      ]}
    >
      {/* Ícono */}
      <View
        style={[
          styles.iconContainer,
          {
            width: config.iconSize,
            height: config.iconSize,
            borderRadius: config.iconSize * 0.3,
          },
        ]}
      >
        <Text style={[styles.iconText, { fontSize: config.iconFont }]}>📊</Text>
      </View>

      {/* Nombre */}
      <View style={styles.textContainer}>
        <Text style={[styles.nameText, { fontSize: config.nameFont }]}>
          <Text style={styles.nameHighlight}>Easy</Text>
          <Text style={styles.nameSuffix}>Tool</Text>
        </Text>
        {showTagline && (
          <Text style={[styles.tagline, { fontSize: config.taglineFont }]}>
            Gestión inteligente de tu negocio
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    backgroundColor: '#00c9a7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,201,167,0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  iconText: {
    textAlign: 'center',
  },
  textContainer: {
    flexDirection: 'column',
  },
  nameText: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  nameHighlight: {
    color: '#1a1a2e',
  },
  nameSuffix: {
    color: '#00c9a7',
  },
  tagline: {
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
});

export default Logo;

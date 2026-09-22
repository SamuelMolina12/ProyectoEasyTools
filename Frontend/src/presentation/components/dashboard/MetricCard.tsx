/**
 * UI Component: MetricCard
 * Tarjeta de métrica para el Dashboard — ícono, valor, título y tendencia.
 */

import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type TrendDirection = 'up' | 'down' | 'neutral';

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: number;       // Porcentaje de cambio (ej: 12.5 = +12.5%)
  trendDirection?: TrendDirection;
  accentColor?: string;
  delay?: number;       // Delay de animación en ms
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendDirection = 'neutral',
  accentColor = '#00c9a7',
  delay = 0,
}) => {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const trendColor = {
    up: '#00c9a7',
    down: '#e84393',
    neutral: '#64748b',
  }[trendDirection];

  const trendIcon = {
    up: '↗',
    down: '↘',
    neutral: '→',
  }[trendDirection];

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      {/* Acento lateral */}
      <View style={[styles.accent, { backgroundColor: accentColor }]} />

      {/* Contenido */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: accentColor + '1A' },
            ]}
          >
            <Text style={styles.iconText}>{icon}</Text>
          </View>
          {trend !== undefined && (
            <View style={[styles.trendBadge, { backgroundColor: trendColor + '1A' }]}>
              <Text style={[styles.trendText, { color: trendColor }]}>
                {trendIcon} {Math.abs(trend).toFixed(1)}%
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    flex: 1,
    minWidth: 150,
  },
  accent: {
    width: 5,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});

export default MetricCard;

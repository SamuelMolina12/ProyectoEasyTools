/**
 * Screen: DashboardScreen
 * Pantalla principal del Dashboard conectada al usuario real y sesión activa — Sprint 1
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { MetricCard } from '../../components/dashboard/MetricCard';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../../application/auth/AuthContext';
import { apiClient } from '../../../infrastructure/services/apiClient';

const QUICK_ACCESS = [
  { icon: '🛒', label: 'Nueva Venta', color: '#00c9a7', bgColor: '#e6fdf8' },
  { icon: '📦', label: 'Inventario', color: '#f39c12', bgColor: '#fef9ec' },
  { icon: '📊', label: 'Reportes', color: '#3b82f6', bgColor: '#eff6ff' },
  { icon: '👥', label: 'Clientes', color: '#e84393', bgColor: '#fde8f2' },
  { icon: '⚙️', label: 'Ajustes', color: '#64748b', bgColor: '#f1f5f9' },
  { icon: '🚪', label: 'Cerrar Sesión', color: '#ef4444', bgColor: '#fee2e2' },
];

interface DashboardStats {
  ventas_hoy: number;
  cantidad_ventas_hoy: number;
  total_productos: number;
  total_clientes: number;
  productos_bajo_stock: number;
}

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    ventas_hoy: 0,
    cantidad_ventas_hoy: 0,
    total_productos: 0,
    total_clientes: 0,
    productos_bajo_stock: 0,
  });

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const handleQuickAction = (label: string) => {
    if (label === 'Inventario') {
      navigation.navigate('Productos');
    } else if (label === 'Nueva Venta') {
      navigation.navigate('Ventas', { screen: 'NewSale' });
    } else if (label === 'Clientes') {
      navigation.navigate('Clientes');
    } else if (label === 'Cerrar Sesión') {
      confirmLogout();
    }
  };

  const confirmLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
  };

  useEffect(() => {
    Animated.stagger(150, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Recargar estadísticas cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      const data = await apiClient.get<DashboardStats>('/dashboard');
      setStats(data);
    } catch {
      // Ignorar si aún no hay conexión
    }
  };

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? '🌅 Buenos días'
      : currentHour < 18
      ? '☀️ Buenas tardes'
      : '🌙 Buenas noches';

  const userName = user?.name || 'Usuario';
  const businessName = user?.businessName || 'Mi Negocio';

  const formatCurrency = (v: number) => `$${Number(v).toLocaleString('es-CO')}`;

  const metrics = [
    {
      title: 'Ventas hoy',
      value: formatCurrency(stats.ventas_hoy),
      icon: '💰',
      trend: stats.cantidad_ventas_hoy,
      trendDirection: 'up' as const,
      accentColor: '#00c9a7',
      delay: 0,
    },
    {
      title: 'Productos registrados',
      value: String(stats.total_productos),
      icon: '📦',
      trend: stats.total_productos > 0 ? 100 : 0,
      trendDirection: 'up' as const,
      accentColor: '#f39c12',
      delay: 80,
    },
    {
      title: 'Clientes',
      value: String(stats.total_clientes),
      icon: '👥',
      trend: stats.total_clientes > 0 ? 100 : 0,
      trendDirection: 'up' as const,
      accentColor: '#e84393',
      delay: 160,
    },
    {
      title: 'Stock bajo',
      value: String(stats.productos_bajo_stock),
      icon: '⚠️',
      trend: stats.productos_bajo_stock,
      trendDirection: 'down' as const,
      accentColor: stats.productos_bajo_stock > 0 ? '#ef4444' : '#3b82f6',
      delay: 240,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* === Header === */}
        <Animated.View style={[styles.header, { opacity: headerAnim }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.userName}>{userName} 👋</Text>
            <Text style={styles.businessName}>🏪 {businessName}</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable
              style={styles.logoutButton}
              onPress={confirmLogout}
              hitSlop={8}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
            </Pressable>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: contentAnim }}>
          {/* === Métricas === */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Resumen del día</Text>
            <Text style={styles.sectionDate}>
              {new Date().toLocaleDateString('es-CO', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>
          </View>

          <View style={styles.metricsGrid}>
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </View>

          {/* === Estado del Sistema === */}
          <Card style={styles.highlightCard} padding={20}>
            <View style={styles.highlightHeader}>
              <Text style={styles.highlightTitle}>⚡ Estado de sincronización</Text>
              <Text style={styles.highlightStatus}>Conectado</Text>
            </View>
            <Text style={styles.highlightSub}>
              Conectado al servidor de {businessName}. Catálogo actualizado en tiempo real.
            </Text>
          </Card>

          {/* === Acceso rápido === */}
          <Text style={styles.sectionTitle2}>Acceso rápido</Text>
          <View style={styles.quickGrid}>
            {QUICK_ACCESS.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => handleQuickAction(item.label)}
                style={({ pressed }) => [
                  styles.quickItem,
                  { backgroundColor: item.bgColor, opacity: pressed ? 0.75 : 1 },
                ]}
              >
                <Text style={styles.quickIcon}>{item.icon}</Text>
                <Text style={[styles.quickLabel, { color: item.color }]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  businessName: {
    fontSize: 13,
    color: '#00c9a7',
    fontWeight: '700',
    marginTop: 3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutIcon: {
    fontSize: 18,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#00c9a7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,201,167,0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: -0.3,
  },
  sectionDate: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  sectionTitle2: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 14,
    marginTop: 24,
    letterSpacing: -0.3,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  highlightCard: {
    borderRadius: 20,
    marginBottom: 0,
    backgroundColor: '#ffffff',
  },
  highlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  highlightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  highlightStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00c9a7',
  },
  highlightSub: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    lineHeight: 18,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickIcon: {
    fontSize: 28,
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default DashboardScreen;

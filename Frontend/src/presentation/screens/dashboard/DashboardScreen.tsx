/**
 * Screen: DashboardScreen
 * Pantalla principal del Dashboard — Sprint 1 (datos mock)
 */

import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { Card } from '../../components/ui/Card';

// Datos mock — serán reemplazados por llamadas a la API en sprints futuros
const MOCK_USER_NAME = 'Samuel';
const MOCK_BUSINESS = 'Tienda El Sol';

const MOCK_METRICS = [
  {
    title: 'Ventas hoy',
    value: '$1.240',
    icon: '💰',
    trend: 12.5,
    trendDirection: 'up' as const,
    accentColor: '#00c9a7',
    delay: 0,
  },
  {
    title: 'Productos activos',
    value: '84',
    icon: '📦',
    trend: 3.2,
    trendDirection: 'up' as const,
    accentColor: '#f39c12',
    delay: 80,
  },
  {
    title: 'Clientes hoy',
    value: '23',
    icon: '👥',
    trend: -5.1,
    trendDirection: 'down' as const,
    accentColor: '#e84393',
    delay: 160,
  },
  {
    title: 'Ticket promedio',
    value: '$53,9',
    icon: '🧾',
    trend: 8.7,
    trendDirection: 'up' as const,
    accentColor: '#3b82f6',
    delay: 240,
  },
];

const QUICK_ACCESS = [
  { icon: '🛒', label: 'Nueva Venta', color: '#00c9a7', bgColor: '#e6fdf8' },
  { icon: '📦', label: 'Inventario', color: '#f39c12', bgColor: '#fef9ec' },
  { icon: '📊', label: 'Reportes', color: '#3b82f6', bgColor: '#eff6ff' },
  { icon: '👥', label: 'Clientes', color: '#e84393', bgColor: '#fde8f2' },
  { icon: '⚙️', label: 'Ajustes', color: '#64748b', bgColor: '#f1f5f9' },
  { icon: '💳', label: 'Pagos', color: '#8b5cf6', bgColor: '#f5f3ff' },
];

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const handleQuickAction = (label: string) => {
    if (label === 'Inventario' || label === 'Nueva Venta') {
      navigation.navigate('Productos');
    }
  };

  React.useEffect(() => {
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

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? '🌅 Buenos días'
      : currentHour < 18
      ? '☀️ Buenas tardes'
      : '🌙 Buenas noches';

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
            <Text style={styles.userName}>{MOCK_USER_NAME} 👋</Text>
            <Text style={styles.businessName}>{MOCK_BUSINESS}</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.notifButton}>
              <Text style={styles.notifIcon}>🔔</Text>
              <View style={styles.notifBadge} />
            </Pressable>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {MOCK_USER_NAME.charAt(0).toUpperCase()}
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
            {MOCK_METRICS.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </View>

          {/* === Venta destacada del día === */}
          <Card style={styles.highlightCard} padding={20}>
            <View style={styles.highlightHeader}>
              <Text style={styles.highlightTitle}>🏆 Meta del día</Text>
              <Text style={styles.highlightPercent}>62%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <View style={styles.highlightFooter}>
              <Text style={styles.highlightSub}>$1.240 de $2.000</Text>
              <Text style={styles.highlightRemaining}>Faltan $760</Text>
            </View>
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

          {/* === Actividad reciente === */}
          <Text style={styles.sectionTitle2}>Actividad reciente</Text>
          <Card padding={0} style={styles.activityCard}>
            {[
              { icon: '💸', title: 'Venta #0042', desc: 'Cliente: María Gómez', amount: '+$85.000', time: 'Hace 12 min', color: '#00c9a7' },
              { icon: '📦', title: 'Stock bajo', desc: 'Producto: Café 500g', amount: '8 unid.', time: 'Hace 1h', color: '#f39c12' },
              { icon: '💸', title: 'Venta #0041', desc: 'Efectivo', amount: '+$32.000', time: 'Hace 2h', color: '#00c9a7' },
            ].map((item, i) => (
              <View
                key={i}
                style={[
                  styles.activityItem,
                  i !== 2 && styles.activityBorder,
                ]}
              >
                <View
                  style={[
                    styles.activityIcon,
                    { backgroundColor: item.color + '1A' },
                  ]}
                >
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityDesc}>{item.desc}</Text>
                </View>
                <View style={styles.activityRight}>
                  <Text style={[styles.activityAmount, { color: item.color }]}>
                    {item.amount}
                  </Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </Card>
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
  // Header
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
    fontWeight: '600',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notifButton: {
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
  notifIcon: {
    fontSize: 20,
  },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e84393',
    borderWidth: 1.5,
    borderColor: '#ffffff',
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
  // Section headers
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
  // Metrics
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  // Highlight card
  highlightCard: {
    borderRadius: 20,
    marginBottom: 0,
  },
  highlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  highlightPercent: {
    fontSize: 20,
    fontWeight: '800',
    color: '#00c9a7',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    width: '62%',
    borderRadius: 4,
    backgroundColor: '#00c9a7',
  },
  highlightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  highlightSub: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  highlightRemaining: {
    fontSize: 13,
    color: '#f39c12',
    fontWeight: '700',
  },
  // Quick access
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
  // Activity
  activityCard: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
});

export default DashboardScreen;

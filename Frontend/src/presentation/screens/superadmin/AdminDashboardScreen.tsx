/**
 * Screen: AdminDashboardScreen
 * Panel de control principal exclusivo para el Super Administrador.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../application/auth/AuthContext';

export const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Panel de Control</Text>
          <Text style={styles.role}>Super Administrador</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} disabled={loggingOut}>
          <Text style={styles.logoutText}>{loggingOut ? 'Cerrando...' : 'Cerrar Sesión'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>¡Bienvenido, {user?.name}!</Text>
        <Text style={styles.subtitle}>
          Desde aquí tienes control total sobre la plataforma EasyTool. Puedes gestionar todos los negocios y sus usuarios.
        </Text>

        <View style={styles.grid}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('AdminNegocios')}
          >
            <Text style={styles.cardIcon}>🏪</Text>
            <Text style={styles.cardTitle}>Gestión de Negocios</Text>
            <Text style={styles.cardDesc}>Ver, activar o desactivar negocios de la plataforma.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  welcome: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  role: { color: '#00c9a7', fontSize: 14, fontWeight: '600' },
  logoutBtn: { backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#1a1a2e', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#64748b', marginBottom: 30, lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIcon: { fontSize: 32, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 6 },
  cardDesc: { fontSize: 14, color: '#64748b', lineHeight: 20 },
});

export default AdminDashboardScreen;

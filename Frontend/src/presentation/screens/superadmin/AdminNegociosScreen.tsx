/**
 * Screen: AdminNegociosScreen
 * Gestión de negocios por parte del Super Administrador.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { adminService, NegocioDetalle } from '../../../infrastructure/services/adminService';

export const AdminNegociosScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [negocios, setNegocios] = useState<NegocioDetalle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNegocios = async () => {
    try {
      setLoading(true);
      const data = await adminService.getNegocios();
      setNegocios(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los negocios');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadNegocios();
    }, [])
  );

  const handleToggle = (negocio: NegocioDetalle) => {
    const accion = negocio.activo ? 'Desactivar' : 'Activar';
    Alert.alert(
      `${accion} negocio`,
      `¿Estás seguro que deseas ${accion.toLowerCase()} "${negocio.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: accion, 
          style: negocio.activo ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await adminService.toggleNegocio(negocio.id);
              loadNegocios(); // Recargar lista
            } catch (e) {
              Alert.alert('Error', 'No se pudo cambiar el estado del negocio');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: NegocioDetalle }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        <View style={[styles.badge, item.activo ? styles.badgeActive : styles.badgeInactive]}>
          <Text style={[styles.badgeText, item.activo ? styles.textActive : styles.textInactive]}>
            {item.activo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.infoText}>Dueño: {item.dueno || 'No especificado'}</Text>
        <Text style={styles.infoText}>Usuarios registrados: {item.total_usuarios}</Text>
        <Text style={styles.infoText}>
          Fecha: {new Date(item.fecha_creacion).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.btn, item.activo ? styles.btnDanger : styles.btnSuccess]}
          onPress={() => handleToggle(item)}
        >
          <Text style={styles.btnText}>{item.activo ? 'Desactivar' : 'Activar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Negocios</Text>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => navigation.navigate('AdminNegocioForm')}
        >
          <Text style={styles.addBtnText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00c9a7" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={negocios}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay negocios registrados</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: { padding: 4 },
  backBtnText: { color: '#00c9a7', fontWeight: 'bold' },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#1a1a2e' },
  addBtn: { backgroundColor: '#00c9a7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeActive: { backgroundColor: '#e6fdf8' },
  badgeInactive: { backgroundColor: '#fee2e2' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  textActive: { color: '#00c9a7' },
  textInactive: { color: '#ef4444' },
  cardBody: { gap: 4, marginBottom: 16 },
  infoText: { fontSize: 13, color: '#64748b' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  btn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  btnSuccess: { backgroundColor: '#00c9a7' },
  btnDanger: { backgroundColor: '#ef4444' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  emptyText: { textAlign: 'center', color: '#64748b', marginTop: 40 },
});

export default AdminNegociosScreen;

/**
 * Screen: ClientesScreen
 * Listado de clientes del negocio.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { clienteService } from '../../../infrastructure/services/clienteService';
import { Cliente } from '../../../domain/entities/Cliente';

export const ClientesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadClientes = useCallback(async (q: string) => {
    try {
      setLoading(true);
      const data = await clienteService.getClientes(q);
      setClientes(data);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadClientes(search);
    }, [search])
  );

  const handleDelete = (id: number, nombre: string) => {
    Alert.alert(
      'Eliminar cliente',
      `¿Estás seguro de que deseas eliminar a ${nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clienteService.deleteCliente(id);
              loadClientes(search);
            } catch (e) {
              Alert.alert('Error', 'No se pudo eliminar el cliente');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Cliente }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.nombre.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{item.nombre}</Text>
          {item.telefono && <Text style={styles.subtext}>📞 {item.telefono}</Text>}
          {item.correo && <Text style={styles.subtext}>✉️ {item.correo}</Text>}
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => navigation.navigate('ClienteForm', { clienteId: item.id })}
        >
          <Text style={styles.actionText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id, item.nombre)}>
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Clientes</Text>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => navigation.navigate('ClienteForm')}
        >
          <Text style={styles.addBtnText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar cliente..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00c9a7" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={clientes}
          keyExtractor={(c) => String(c.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyText}>No se encontraron clientes</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e' },
  addBtn: { backgroundColor: '#00c9a7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  searchContainer: { padding: 16, backgroundColor: '#fff' },
  searchInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
  },
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e84393', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 4 },
  subtext: { fontSize: 13, color: '#64748b' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 8, backgroundColor: '#f1f5f9', borderRadius: 8 },
  actionText: { fontSize: 16 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#64748b', fontSize: 15 },
});

export default ClientesScreen;

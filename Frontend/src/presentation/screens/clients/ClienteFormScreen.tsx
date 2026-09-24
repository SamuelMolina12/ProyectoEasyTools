/**
 * Screen: ClienteFormScreen
 * Formulario para crear o editar un cliente.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { clienteService } from '../../../infrastructure/services/clienteService';

export const ClienteFormScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const clienteId = route.params?.clienteId;
  const isEditing = !!clienteId;

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    direccion: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadCliente();
    }
  }, [clienteId]);

  const loadCliente = async () => {
    try {
      setLoading(true);
      const cliente = await clienteService.getClienteById(clienteId);
      setFormData({
        nombre: cliente.nombre,
        telefono: cliente.telefono || '',
        correo: cliente.correo || '',
        direccion: cliente.direccion || '',
      });
    } catch (e) {
      Alert.alert('Error', 'No se pudo cargar el cliente');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Validación', 'El nombre del cliente es obligatorio');
      return;
    }

    try {
      setSaving(true);
      const data = {
        ...formData,
        telefono: formData.telefono.trim() || undefined,
        correo: formData.correo.trim() || undefined,
        direccion: formData.direccion.trim() || undefined,
      };

      if (isEditing) {
        await clienteService.updateCliente(clienteId, data);
      } else {
        await clienteService.createCliente(data);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el cliente');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00c9a7" style={{ marginTop: 40 }} />
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                style={styles.input}
                value={formData.nombre}
                onChangeText={(t) => setFormData({ ...formData, nombre: t })}
                placeholder="Ej. Juan Pérez"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={styles.input}
                value={formData.telefono}
                onChangeText={(t) => setFormData({ ...formData, telefono: t })}
                placeholder="Ej. 300 123 4567"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={styles.input}
                value={formData.correo}
                onChangeText={(t) => setFormData({ ...formData, correo: t })}
                placeholder="Ej. juan@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección</Text>
              <TextInput
                style={styles.input}
                value={formData.direccion}
                onChangeText={(t) => setFormData({ ...formData, direccion: t })}
                placeholder="Ej. Calle 123 #45-67"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Guardar Cliente</Text>}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
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
  form: { padding: 20, gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#1a1a2e' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: '#00c9a7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnDisabled: { backgroundColor: '#94a3b8' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ClienteFormScreen;

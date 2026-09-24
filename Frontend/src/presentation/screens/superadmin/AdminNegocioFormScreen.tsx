/**
 * Screen: AdminNegocioFormScreen
 * Formulario para crear nuevos negocios desde el panel de Super Administrador.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { adminService } from '../../../infrastructure/services/adminService';

export const AdminNegocioFormScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [nombre, setNombre] = useState('');
  const [actividad, setActividad] = useState('');
  const [codigoAcceso, setCodigoAcceso] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nombre.trim() || !codigoAcceso.trim()) {
      Alert.alert('Error', 'El nombre y la clave de acceso son obligatorios.');
      return;
    }
    if (codigoAcceso.length < 4) {
      Alert.alert('Error', 'La clave de acceso debe tener al menos 4 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await adminService.createNegocio({
        nombre: nombre.trim(),
        actividad: actividad.trim() || undefined,
        codigo_acceso: codigoAcceso.trim()
      });
      Alert.alert('Éxito', 'Negocio creado correctamente', [
        { text: 'Aceptar', onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo crear el negocio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Negocio</Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.instructions}>Crea un nuevo negocio. Luego podrás registrar el primer usuario (dueño) usando la clave que definas aquí.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Negocio *</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej. Supermercado Central"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Actividad Comercial</Text>
            <TextInput
              style={styles.input}
              value={actividad}
              onChangeText={setActividad}
              placeholder="Ej. Abarrotes, Ferretería..."
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Clave de Acceso (Código Secreto) *</Text>
            <TextInput
              style={styles.input}
              value={codigoAcceso}
              onChangeText={setCodigoAcceso}
              placeholder="Ej. SECRETO123"
              secureTextEntry
            />
            <Text style={styles.hint}>Los usuarios necesitarán esta clave para unirse a este negocio.</Text>
          </View>

          <TouchableOpacity 
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Crear Negocio</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  instructions: { fontSize: 14, color: '#64748b', marginBottom: 10 },
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
  hint: { fontSize: 12, color: '#94a3b8' },
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

export default AdminNegocioFormScreen;

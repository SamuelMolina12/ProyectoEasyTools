/**
 * Screen: RegisterScreen
 * Pantalla de registro de nuevo usuario vinculado a un negocio real — Sprint 1
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Logo } from '../../components/ui/Logo';
import { useRegisterForm } from '../../../application/auth/useAuthForm';
import { useAuth } from '../../../application/auth/AuthContext';
import { negocioService } from '../../../infrastructure/services/negocioService';
import { Negocio } from '../../../domain/entities/User';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
  onRegisterSuccess?: () => void;
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  navigation,
  onRegisterSuccess,
}) => {
  const { register } = useAuth();
  const {
    data,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,
    showBusinessCode,
    setIsLoading,
    setErrors,
    updateField,
    validate,
    toggleShowPassword,
    toggleShowConfirmPassword,
    toggleShowBusinessCode,
  } = useRegisterForm();

  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [loadingNegocios, setLoadingNegocios] = useState<boolean>(false);
  const [showNegocioModal, setShowNegocioModal] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 5,
        speed: 10,
      }),
    ]).start();

    // Cargar lista de negocios desde el backend
    loadNegocios();
  }, []);

  const loadNegocios = async () => {
    setLoadingNegocios(true);
    try {
      const items = await negocioService.getNegocios();
      setNegocios(items);
    } catch {
      // Error silencioso al cargar negocios
    } finally {
      setLoadingNegocios(false);
    }
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(data);
      onRegisterSuccess?.();
    } catch (err: any) {
      setErrors({ general: err.message || 'Ocurrió un error al registrar la cuenta.' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedNegocio = negocios.find((n) => n.id === data.negocio_id);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fondo decorativo */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Logo size="md" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Crea tu cuenta</Text>
              <Text style={styles.headerSubtitle}>
                Regístrate y conéctate al sistema de tu negocio
              </Text>
            </View>
          </Animated.View>

          {/* Formulario */}
          <Animated.View
            style={[
              styles.card,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Error general */}
            {errors.general && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠ {errors.general}</Text>
              </View>
            )}

            {/* Nombre */}
            <Input
              label="Tu nombre completo *"
              placeholder="Ej: Juan Carlos"
              autoCapitalize="words"
              value={data.name}
              onChangeText={(v) => updateField('name', v)}
              error={errors.name}
              leftIcon={<Text style={styles.fieldIcon}>👤</Text>}
            />

            {/* Selector de Negocio */}
            <View style={styles.fieldContainer}>
              <Text
                style={[
                  styles.fieldLabel,
                  { color: errors.negocio_id ? '#e84393' : '#64748b' },
                ]}
              >
                Negocio al que perteneces *
              </Text>
              <Pressable
                onPress={() => setShowNegocioModal(true)}
                style={[
                  styles.negocioSelector,
                  errors.negocio_id && styles.negocioSelectorError,
                ]}
              >
                <Text style={styles.fieldIcon}>🏪</Text>
                <Text
                  style={[
                    styles.negocioSelectorText,
                    !selectedNegocio && styles.negocioSelectorPlaceholder,
                  ]}
                  numberOfLines={1}
                >
                  {selectedNegocio
                    ? selectedNegocio.nombre
                    : loadingNegocios
                      ? 'Cargando negocios disponibles...'
                      : 'Selecciona tu negocio'}
                </Text>
                <Text style={styles.negocioSelectorArrow}>›</Text>
              </Pressable>
              {errors.negocio_id && (
                <Text style={styles.fieldError}>⚠ {errors.negocio_id}</Text>
              )}
            </View>

            {/* Clave de Acceso del Negocio */}
            <Input
              label="Clave secreta del negocio *"
              placeholder="Código asignado por el negocio"
              secureTextEntry={!showBusinessCode}
              value={data.codigo_negocio}
              onChangeText={(v) => updateField('codigo_negocio', v)}
              error={errors.codigo_negocio}
              leftIcon={<Text style={styles.fieldIcon}>🔑</Text>}
              rightIcon={
                <Text style={styles.fieldIcon}>
                  {showBusinessCode ? '🙈' : '👁'}
                </Text>
              }
              onRightIconPress={toggleShowBusinessCode}
            />

            {/* Email */}
            <Input
              label="Correo electrónico *"
              placeholder="tu@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={data.email}
              onChangeText={(v) => updateField('email', v)}
              error={errors.email}
              leftIcon={<Text style={styles.fieldIcon}>✉</Text>}
            />

            {/* Contraseña */}
            <Input
              label="Contraseña *"
              placeholder="Mínimo 6 caracteres"
              secureTextEntry={!showPassword}
              value={data.password}
              onChangeText={(v) => updateField('password', v)}
              error={errors.password}
              leftIcon={<Text style={styles.fieldIcon}>🔒</Text>}
              rightIcon={
                <Text style={styles.fieldIcon}>
                  {showPassword ? '🙈' : '👁'}
                </Text>
              }
              onRightIconPress={toggleShowPassword}
            />

            {/* Confirmar contraseña */}
            <Input
              label="Confirmar contraseña *"
              placeholder="Repite tu contraseña"
              secureTextEntry={!showConfirmPassword}
              value={data.confirmPassword}
              onChangeText={(v) => updateField('confirmPassword', v)}
              error={errors.confirmPassword}
              leftIcon={<Text style={styles.fieldIcon}>🔐</Text>}
              rightIcon={
                <Text style={styles.fieldIcon}>
                  {showConfirmPassword ? '🙈' : '👁'}
                </Text>
              }
              onRightIconPress={toggleShowConfirmPassword}
            />

            {/* Mensaje informativo */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                EasyTool garantiza la seguridad y privacidad de la información comercial de tu negocio.
              </Text>
            </View>

            {/* Botón de Registro */}
            <Button
              label="Crear mi cuenta"
              onPress={handleRegister}
              variant="primary"
              size="lg"
              loading={isLoading}
            />
          </Animated.View>

          {/* Link a Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal selector de negocio */}
      <Modal
        visible={showNegocioModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNegocioModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowNegocioModal(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Selecciona tu Negocio</Text>
            <Text style={styles.modalSubtitle}>
              Elige el establecimiento al que perteneces
            </Text>

            {loadingNegocios ? (
              <View style={styles.modalLoader}>
                <ActivityIndicator size="small" color="#00c9a7" />
                <Text style={styles.modalLoaderText}>Cargando negocios...</Text>
              </View>
            ) : negocios.length === 0 ? (
              <View style={styles.modalEmpty}>
                <Text style={styles.modalEmptyText}>No hay negocios disponibles</Text>
                <Button
                  label="Reintentar"
                  onPress={loadNegocios}
                  variant="outline"
                  size="sm"
                />
              </View>
            ) : (
              <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
                {negocios.map((neg) => {
                  const isSelected = data.negocio_id === neg.id;
                  return (
                    <Pressable
                      key={neg.id}
                      onPress={() => {
                        updateField('negocio_id', neg.id);
                        updateField('businessName', neg.nombre);
                        setShowNegocioModal(false);
                      }}
                      style={[
                        styles.negocioOption,
                        isSelected && styles.negocioOptionActive,
                      ]}
                    >
                      <View style={styles.negocioOptionIcon}>
                        <Text style={{ fontSize: 20 }}>🏪</Text>
                      </View>
                      <View style={styles.negocioOptionInfo}>
                        <Text
                          style={[
                            styles.negocioOptionTitle,
                            isSelected && styles.negocioOptionTitleActive,
                          ]}
                        >
                          {neg.nombre}
                        </Text>
                        {neg.actividad && (
                          <Text style={styles.negocioOptionSubtitle}>
                            {neg.actividad}
                          </Text>
                        )}
                      </View>
                      {isSelected && (
                        <Text style={styles.negocioCheck}>✓</Text>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  bgCircle1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#00c9a7',
    opacity: 0.07,
  },
  bgCircle2: {
    position: 'absolute',
    bottom: 40,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e84393',
    opacity: 0.06,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 24,
  },
  errorBanner: {
    backgroundColor: '#fde8f2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e84393',
  },
  errorBannerText: {
    color: '#c0246e',
    fontSize: 13,
    fontWeight: '600',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  negocioSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    minHeight: 52,
    gap: 10,
  },
  negocioSelectorError: {
    borderColor: '#e84393',
    borderWidth: 2,
  },
  negocioSelectorText: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a2e',
    fontWeight: '500',
  },
  negocioSelectorPlaceholder: {
    color: '#94a3b8',
  },
  negocioSelectorArrow: {
    fontSize: 20,
    color: '#94a3b8',
    fontWeight: '700',
  },
  fieldIcon: {
    fontSize: 16,
  },
  fieldError: {
    color: '#e84393',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  termsContainer: {
    marginBottom: 20,
    marginTop: 4,
  },
  termsText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  loginLink: {
    color: '#00c9a7',
    fontSize: 14,
    fontWeight: '700',
  },
  // Modal selector de negocio
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '70%',
    paddingBottom: 36,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  modalLoader: {
    padding: 30,
    alignItems: 'center',
    gap: 10,
  },
  modalLoaderText: {
    color: '#64748b',
    fontSize: 13,
  },
  modalEmpty: {
    padding: 30,
    alignItems: 'center',
    gap: 12,
  },
  modalEmptyText: {
    color: '#64748b',
    fontSize: 14,
  },
  modalList: {
    maxHeight: 300,
  },
  negocioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  negocioOptionActive: {
    backgroundColor: '#e6fdf8',
    borderColor: '#00c9a7',
  },
  negocioOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  negocioOptionInfo: {
    flex: 1,
  },
  negocioOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  negocioOptionTitleActive: {
    color: '#008b73',
  },
  negocioOptionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  negocioCheck: {
    fontSize: 16,
    color: '#00c9a7',
    fontWeight: '800',
  },
});

export default RegisterScreen;

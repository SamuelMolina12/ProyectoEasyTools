/**
 * Screen: RegisterScreen
 * Pantalla de registro de nuevo usuario/negocio — Sprint 1
 */

import React, { useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
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
import { mockRegister } from '../../../infrastructure/services/authService.mock';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
  onRegisterSuccess?: () => void;
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  navigation,
  onRegisterSuccess,
}) => {
  const {
    data,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,
    setIsLoading,
    setErrors,
    updateField,
    validate,
    toggleShowPassword,
    toggleShowConfirmPassword,
  } = useRegisterForm();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  React.useEffect(() => {
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
  }, []);

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await mockRegister(data);
      // En Sprint 2+: guardar token, navegar al Dashboard
      onRegisterSuccess?.();
    } catch (err: any) {
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

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
                Comienza a gestionar tu negocio hoy mismo
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

            {/* Paso visual */}
            <View style={styles.stepsContainer}>
              <View style={styles.stepActive}>
                <Text style={styles.stepText}>1</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepInactive}>
                <Text style={styles.stepTextInactive}>2</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepInactive}>
                <Text style={styles.stepTextInactive}>3</Text>
              </View>
            </View>
            <Text style={styles.stepsLabel}>Información básica</Text>

            {/* Nombre */}
            <Input
              label="Tu nombre completo"
              placeholder="Ej: Juan Pérez"
              autoCapitalize="words"
              value={data.name}
              onChangeText={(v) => updateField('name', v)}
              error={errors.name}
              leftIcon={<Text style={styles.fieldIcon}>👤</Text>}
            />

            {/* Nombre del negocio */}
            <Input
              label="Nombre del negocio"
              placeholder="Ej: Tienda El Sol"
              autoCapitalize="words"
              value={data.businessName}
              onChangeText={(v) => updateField('businessName', v)}
              error={errors.businessName}
              leftIcon={<Text style={styles.fieldIcon}>🏪</Text>}
            />

            {/* Email */}
            <Input
              label="Correo electrónico"
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
              label="Contraseña"
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
              label="Confirmar contraseña"
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

            {/* Términos y condiciones */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                Al registrarte, aceptas nuestros{' '}
                <Text style={styles.termsLink}>Términos de uso</Text>
                {' '}y{' '}
                <Text style={styles.termsLink}>Política de privacidad</Text>
              </Text>
            </View>

            {/* Botón */}
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
    marginBottom: 28,
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
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#00c9a7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepInactive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 6,
  },
  stepText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  stepTextInactive: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  stepsLabel: {
    fontSize: 12,
    color: '#00c9a7',
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  fieldIcon: {
    fontSize: 16,
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
  termsLink: {
    color: '#00c9a7',
    fontWeight: '600',
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
});

export default RegisterScreen;

/**
 * Screen: LoginScreen
 * Pantalla de inicio de sesión conectada al backend real — Sprint 1
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
import { useLoginForm } from '../../../application/auth/useAuthForm';
import { useAuth } from '../../../application/auth/AuthContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
  onLoginSuccess?: () => void;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({
  navigation,
  onLoginSuccess,
}) => {
  const { login } = useAuth();
  const {
    credentials,
    errors,
    isLoading,
    showPassword,
    setIsLoading,
    setErrors,
    updateField,
    validate,
    toggleShowPassword,
  } = useLoginForm();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 6,
        speed: 10,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(credentials);
      onLoginSuccess?.();
    } catch (err: any) {
      setErrors({
        general: err.message || 'Credenciales inválidas. Por favor intenta de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fondo decorativo */}
      <View style={styles.bgTop} />
      <View style={styles.bgCircle} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header con Logo */}
          <Animated.View
            style={[
              styles.header,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Logo size="lg" animate showTagline />
          </Animated.View>

          {/* Tarjeta del formulario */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 40],
                      outputRange: [0, 60],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.cardTitle}>Bienvenido de vuelta</Text>
            <Text style={styles.cardSubtitle}>
              Ingresa tus credenciales para continuar
            </Text>

            {/* Error general */}
            {errors.general && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠ {errors.general}</Text>
              </View>
            )}

            {/* Campos */}
            <Input
              label="Correo electrónico"
              placeholder="tu@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={credentials.email}
              onChangeText={(v) => updateField('email', v)}
              error={errors.email}
              leftIcon={<Text style={styles.fieldIcon}>✉</Text>}
            />

            <Input
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              secureTextEntry={!showPassword}
              value={credentials.password}
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

            {/* Olvidé contraseña */}
            <Pressable style={styles.forgotContainer}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            {/* Botón de login */}
            <View style={styles.buttonContainer}>
              <Button
                label="Iniciar Sesión"
                onPress={handleLogin}
                variant="primary"
                size="lg"
                loading={isLoading}
              />
            </View>

            {/* Separador */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>o</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Link a Registro */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes cuenta? </Text>
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Regístrate aquí</Text>
              </Pressable>
            </View>
          </Animated.View>
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
  bgTop: {
    position: 'absolute',
    top: -60,
    left: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#00c9a7',
    opacity: 0.08,
  },
  bgCircle: {
    position: 'absolute',
    top: 60,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#f39c12',
    opacity: 0.07,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    fontWeight: '500',
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
  fieldIcon: {
    fontSize: 16,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -4,
  },
  forgotText: {
    color: '#00c9a7',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  separatorText: {
    marginHorizontal: 12,
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  registerLink: {
    color: '#00c9a7',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LoginScreen;

/**
 * Screen: ProductFormScreen — HU-05
 * Formulario para registrar un nuevo producto.
 */

import React, { useRef, useState } from 'react';
import {
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
import { Card } from '../../components/ui/Card';
import { useProductForm } from '../../../application/products/useProductForm';
import { mockCreateProduct } from '../../../infrastructure/services/productService.mock';
import {
  PRODUCT_CATEGORIES,
  ProductCategory,
} from '../../../domain/entities/Product';
import { ProductsStackParamList } from '../../navigation/ProductsNavigator';

type ProductFormScreenProps = {
  navigation: NativeStackNavigationProp<ProductsStackParamList, 'ProductForm'>;
};

// Mapa de emojis por categoría
const CATEGORY_ICONS: Record<string, string> = {
  alimentos: '🥫',
  bebidas: '🧃',
  limpieza: '🧹',
  papelería: '📝',
  electrónica: '💡',
  ropa: '👕',
  hogar: '🏠',
  salud: '💊',
  otro: '📦',
};

export const ProductFormScreen: React.FC<ProductFormScreenProps> = ({
  navigation,
}) => {
  const {
    data,
    errors,
    isLoading,
    setIsLoading,
    setErrors,
    updateField,
    setCategory,
    validate,
  } = useProductForm();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 4, speed: 12 }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await mockCreateProduct(data);
      setShowSuccess(true);
    } catch (err: any) {
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigation.goBack();
  };

  const selectedCat = PRODUCT_CATEGORIES.find((c) => c.value === data.category);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.topTitle}>Nuevo Producto</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          >
            {/* Error general */}
            {errors.general && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠ {errors.general}</Text>
              </View>
            )}

            {/* Sección: Información básica */}
            <Text style={styles.sectionLabel}>📋 Información básica</Text>
            <Card style={styles.card}>
              <Input
                label="Nombre del producto *"
                placeholder="Ej: Café Sello Rojo 500g"
                autoCapitalize="words"
                value={data.name}
                onChangeText={(v) => updateField('name', v)}
                error={errors.name}
                leftIcon={<Text style={styles.fieldIcon}>🏷️</Text>}
              />

              {/* Selector de categoría */}
              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: errors.category ? '#e84393' : '#64748b' },
                  ]}
                >
                  Categoría *
                </Text>
                <Pressable
                  onPress={() => setShowCategoryModal(true)}
                  style={[
                    styles.categorySelector,
                    errors.category && styles.categorySelectorError,
                  ]}
                >
                  <Text style={styles.categorySelectorIcon}>
                    {data.category
                      ? CATEGORY_ICONS[data.category]
                      : '🏷️'}
                  </Text>
                  <Text
                    style={[
                      styles.categorySelectorText,
                      !selectedCat && styles.categorySelectorPlaceholder,
                    ]}
                  >
                    {selectedCat ? selectedCat.label : 'Selecciona una categoría'}
                  </Text>
                  <Text style={styles.categorySelectorArrow}>›</Text>
                </Pressable>
                {errors.category && (
                  <Text style={styles.fieldError}>⚠ {errors.category}</Text>
                )}
              </View>

              <Input
                label="Descripción (opcional)"
                placeholder="Breve descripción del producto"
                autoCapitalize="sentences"
                multiline
                numberOfLines={3}
                value={data.description}
                onChangeText={(v) => updateField('description', v)}
                leftIcon={<Text style={styles.fieldIcon}>📄</Text>}
              />
            </Card>

            {/* Sección: Precio y stock */}
            <Text style={styles.sectionLabel}>💰 Precio y stock</Text>
            <Card style={styles.card}>
              <Input
                label="Precio (COP) *"
                placeholder="Ej: 12500"
                keyboardType="numeric"
                value={data.price}
                onChangeText={(v) => updateField('price', v)}
                error={errors.price}
                leftIcon={<Text style={styles.fieldIcon}>$</Text>}
              />
              <Input
                label="Stock inicial *"
                placeholder="Ej: 50"
                keyboardType="numeric"
                value={data.stock}
                onChangeText={(v) => updateField('stock', v)}
                error={errors.stock}
                leftIcon={<Text style={styles.fieldIcon}>📦</Text>}
              />

              {/* Preview de precio formateado */}
              {data.price && !isNaN(parseFloat(data.price)) && (
                <View style={styles.previewBadge}>
                  <Text style={styles.previewText}>
                    💡 Precio formateado:{' '}
                    <Text style={styles.previewValue}>
                      ${parseFloat(data.price).toLocaleString('es-CO')}
                    </Text>
                  </Text>
                </View>
              )}
            </Card>

            {/* Botones */}
            <View style={styles.buttonsContainer}>
              <Button
                label="Guardar producto"
                onPress={handleSubmit}
                variant="primary"
                size="lg"
                loading={isLoading}
              />
              <View style={styles.cancelBtn}>
                <Button
                  label="Cancelar"
                  onPress={() => navigation.goBack()}
                  variant="outline"
                  size="md"
                  disabled={isLoading}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal selector de categoría */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Selecciona una categoría</Text>
            {PRODUCT_CATEGORIES.map((cat) => (
              <Pressable
                key={cat.value}
                onPress={() => {
                  setCategory(cat.value as ProductCategory);
                  setShowCategoryModal(false);
                }}
                style={[
                  styles.categoryOption,
                  data.category === cat.value && styles.categoryOptionActive,
                ]}
              >
                <Text style={styles.categoryOptionIcon}>
                  {CATEGORY_ICONS[cat.value]}
                </Text>
                <Text
                  style={[
                    styles.categoryOptionText,
                    data.category === cat.value && styles.categoryOptionTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
                {data.category === cat.value && (
                  <Text style={styles.categoryCheck}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Modal de éxito */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text style={styles.successTitle}>¡Producto guardado!</Text>
            <Text style={styles.successSubtitle}>
              <Text style={styles.successName}>{data.name}</Text> fue agregado
              correctamente al catálogo.
            </Text>
            <View style={styles.successButton}>
              <Button
                label="Ir al catálogo"
                onPress={handleSuccessClose}
                variant="primary"
                size="md"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  backIcon: {
    fontSize: 20,
    color: '#1a1a2e',
    fontWeight: '700',
    lineHeight: 22,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  errorBanner: {
    backgroundColor: '#fde8f2',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e84393',
  },
  errorBannerText: {
    color: '#c0246e',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
  },
  fieldIcon: {
    fontSize: 16,
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
  categorySelector: {
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
  categorySelectorError: {
    borderColor: '#e84393',
    borderWidth: 2,
  },
  categorySelectorIcon: {
    fontSize: 18,
  },
  categorySelectorText: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a2e',
    fontWeight: '500',
  },
  categorySelectorPlaceholder: {
    color: '#94a3b8',
  },
  categorySelectorArrow: {
    fontSize: 20,
    color: '#94a3b8',
    fontWeight: '700',
  },
  fieldError: {
    color: '#e84393',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  previewBadge: {
    backgroundColor: '#e6fdf8',
    borderRadius: 10,
    padding: 10,
    marginTop: -4,
  },
  previewText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  previewValue: {
    color: '#00b894',
    fontWeight: '800',
  },
  buttonsContainer: {
    marginTop: 8,
    gap: 12,
  },
  cancelBtn: {},
  // Modal de categoría
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
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 12,
    marginBottom: 4,
  },
  categoryOptionActive: {
    backgroundColor: '#e6fdf8',
  },
  categoryOptionIcon: {
    fontSize: 22,
  },
  categoryOptionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  categoryOptionTextActive: {
    color: '#00b894',
  },
  categoryCheck: {
    fontSize: 16,
    color: '#00c9a7',
    fontWeight: '800',
  },
  // Modal de éxito
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 20,
  },
  successIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  successName: {
    color: '#00c9a7',
    fontWeight: '700',
  },
  successButton: {
    width: '100%',
  },
});

export default ProductFormScreen;

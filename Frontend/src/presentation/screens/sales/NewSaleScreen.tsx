/**
 * Screen: NewSaleScreen
 * Flujo completo de registro de una nueva venta:
 * Buscar productos → agregar al carrito → indicar cantidades → ver total → confirmar → registrar en BD
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { productService } from '../../../infrastructure/services/productService';
import { ventaService } from '../../../infrastructure/services/ventaService';
import { Product } from '../../../domain/entities/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

const formatCurrency = (v: number) =>
  `$${Number(v).toLocaleString('es-CO')}`;

export const NewSaleScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // ── Estado del catálogo ──────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // ── Estado del carrito ───────────────────────────────────────────────────
  const [cart, setCart] = useState<CartItem[]>([]);

  // ── Estado del registro ──────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'catalog' | 'cart'>('catalog');

  // ── Cargar productos ─────────────────────────────────────────────────────
  const loadProducts = useCallback(async (q: string) => {
    setLoadingProducts(true);
    try {
      const res = await productService.getProducts(1, 50, q || undefined);
      setProducts(res.products.filter((p) => p.stock > 0));
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    loadProducts('');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadProducts(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Carrito: agregar / quitar ────────────────────────────────────────────
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          Alert.alert('Sin stock', `Solo hay ${product.stock} unidades disponibles de "${product.name}".`);
          return prev;
        }
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.product.id !== productId) return i;
          const newQty = i.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > i.product.stock) {
            Alert.alert('Stock insuficiente', `Solo hay ${i.product.stock} unidades de "${i.product.name}".`);
            return i;
          }
          return { ...i, quantity: newQty };
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // ── Estado de feedback ─────────────────────────────────────────────────
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // ── Confirmar venta ──────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (cart.length === 0) {
      setErrorMsg('Agrega al menos un producto antes de confirmar la venta.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        detalles: cart.map((i) => ({
          producto_id: parseInt(i.product.id, 10),
          cantidad: i.quantity,
        })),
        cliente_id: null,
      };
      await ventaService.createVenta(payload);
      setSuccessMsg(`✅ Venta por ${formatCurrency(cartTotal)} registrada exitosamente.`);
      setCart([]);
      // Volver al catálogo después de 2 segundos
      setTimeout(() => {
        setSuccessMsg('');
        setStep('catalog');
        loadProducts('');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render: tarjeta de producto en catálogo ──────────────────────────────
  const renderProduct = ({ item }: { item: Product }) => {
    const inCart = cart.find((c) => c.product.id === item.id);
    return (
      <Pressable
        style={({ pressed }) => [styles.productCard, pressed && { opacity: 0.85 }]}
        onPress={() => addToCart(item)}
      >
        <View style={styles.productCardInner}>
          <View style={styles.productEmoji}>
            <Text style={styles.productEmojiText}>📦</Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.productCategory}>{item.category}</Text>
            <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
          </View>
          <View style={styles.productRight}>
            <Text style={styles.stockText}>Stock: {item.stock}</Text>
            {inCart ? (
              <View style={styles.inCartBadge}>
                <Text style={styles.inCartText}>{inCart.quantity} en carrito</Text>
              </View>
            ) : (
              <View style={styles.addBtn}>
                <Text style={styles.addBtnText}>+ Agregar</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  // ── Render: ítem del carrito ─────────────────────────────────────────────
  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemLeft}>
        <Text style={styles.cartItemName} numberOfLines={1}>{item.product.name}</Text>
        <Text style={styles.cartItemPrice}>{formatCurrency(item.product.price)} c/u</Text>
      </View>
      <View style={styles.cartItemControls}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => updateQuantity(item.product.id, -1)}
        >
          <Text style={styles.qtyBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => updateQuantity(item.product.id, 1)}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cartItemRight}>
        <Text style={styles.cartSubtotal}>{formatCurrency(item.product.price * item.quantity)}</Text>
        <TouchableOpacity onPress={() => removeFromCart(item.product.id)}>
          <Text style={styles.removeBtn}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ── Pantalla de catálogo ─────────────────────────────────────────────────
  if (step === 'catalog') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nueva Venta</Text>
          <TouchableOpacity
            style={[styles.cartBtn, cart.length === 0 && styles.cartBtnDisabled]}
            onPress={() => cart.length > 0 && setStep('cart')}
          >
            <Text style={styles.cartBtnText}>🛒 {cartCount > 0 ? cartCount : ''}</Text>
          </TouchableOpacity>
        </View>

        {/* Búsqueda */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Buscar producto..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <Text style={styles.hint}>Toca un producto para agregarlo al carrito</Text>

        {/* Lista de productos */}
        {loadingProducts ? (
          <ActivityIndicator size="large" color="#00c9a7" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(p) => p.id}
            renderItem={renderProduct}
            contentContainerStyle={styles.productList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyText}>No se encontraron productos con stock disponible</Text>
              </View>
            }
          />
        )}

        {/* Barra inferior del carrito */}
        {cart.length > 0 && (
          <View style={styles.cartBar}>
            <View>
              <Text style={styles.cartBarItems}>{cartCount} producto{cartCount !== 1 ? 's' : ''}</Text>
              <Text style={styles.cartBarTotal}>{formatCurrency(cartTotal)}</Text>
            </View>
            <TouchableOpacity style={styles.cartBarBtn} onPress={() => setStep('cart')}>
              <Text style={styles.cartBarBtnText}>Ver carrito →</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ── Pantalla del carrito / resumen ───────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep('catalog')} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Catálogo</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resumen de venta</Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <FlatList
          data={cart}
          keyExtractor={(i) => i.product.id}
          renderItem={renderCartItem}
          contentContainerStyle={styles.cartList}
          ListHeaderComponent={
            <Text style={styles.cartSectionTitle}>Productos en la venta</Text>
          }
          ListFooterComponent={
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>{formatCurrency(cartTotal)}</Text>
              </View>
              <View style={[styles.totalRow, styles.totalRowFinal]}>
                <Text style={styles.totalLabelFinal}>TOTAL</Text>
                <Text style={styles.totalValueFinal}>{formatCurrency(cartTotal)}</Text>
              </View>
            </View>
          }
        />

        {/* Mensajes de feedback */}
        {successMsg !== '' && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        )}
        {errorMsg !== '' && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Botón de confirmar */}
        <View style={styles.confirmSection}>
          <TouchableOpacity
            style={[styles.confirmBtn, isSubmitting && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            disabled={isSubmitting || successMsg !== ''}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmBtnText}>✅ Confirmar venta — {formatCurrency(cartTotal)}</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f4f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: { paddingVertical: 4, paddingHorizontal: 4 },
  backBtnText: { color: '#00c9a7', fontWeight: '700', fontSize: 14 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1a1a2e' },
  cartBtn: {
    backgroundColor: '#00c9a7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 48,
    alignItems: 'center',
  },
  cartBtnDisabled: { backgroundColor: '#e2e8f0' },
  cartBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1a1a2e',
  },
  hint: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
  },
  productList: { padding: 12, gap: 10 },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  productCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  productEmoji: {
    width: 44,
    height: 44,
    backgroundColor: '#e6fdf8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productEmojiText: { fontSize: 22 },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  productCategory: { fontSize: 12, color: '#94a3b8', fontWeight: '500', marginTop: 2, textTransform: 'capitalize' },
  productPrice: { fontSize: 14, fontWeight: '800', color: '#00c9a7', marginTop: 2 },
  productRight: { alignItems: 'flex-end', gap: 6 },
  stockText: { fontSize: 11, color: '#64748b', fontWeight: '500' },
  addBtn: {
    backgroundColor: '#00c9a7',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  inCartBadge: {
    backgroundColor: '#e6fdf8',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#00c9a7',
  },
  inCartText: { color: '#00c9a7', fontSize: 11, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#94a3b8', fontSize: 14, fontWeight: '500', textAlign: 'center' },
  // Cart bar
  cartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
    paddingVertical: 14,
    margin: 12,
    borderRadius: 18,
  },
  cartBarItems: { color: '#94a3b8', fontSize: 12, fontWeight: '500' },
  cartBarTotal: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
  cartBarBtn: {
    backgroundColor: '#00c9a7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cartBarBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  // Cart view
  cartList: { padding: 16 },
  cartSectionTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a2e', marginBottom: 12 },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cartItemLeft: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  cartItemPrice: { fontSize: 12, color: '#64748b', fontWeight: '500', marginTop: 2 },
  cartItemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 12,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  qtyValue: { fontSize: 16, fontWeight: '800', color: '#1a1a2e', minWidth: 24, textAlign: 'center' },
  cartItemRight: { alignItems: 'flex-end', gap: 4 },
  cartSubtotal: { fontSize: 15, fontWeight: '800', color: '#00c9a7' },
  removeBtn: { fontSize: 16, marginTop: 2 },
  totalSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    gap: 10,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalRowFinal: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  totalValue: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  totalLabelFinal: { fontSize: 17, fontWeight: '800', color: '#1a1a2e' },
  totalValueFinal: { fontSize: 22, fontWeight: '800', color: '#00c9a7' },
  confirmSection: { padding: 16, backgroundColor: '#f0f4f8' },
  confirmBtn: {
    backgroundColor: '#00c9a7',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#00c9a7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  confirmBtnDisabled: { backgroundColor: '#94a3b8' },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  successBanner: {
    backgroundColor: '#e6fdf8',
    borderWidth: 1,
    borderColor: '#00c9a7',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  successText: { color: '#059669', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  errorBanner: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  errorText: { color: '#dc2626', fontSize: 14, fontWeight: '600', textAlign: 'center' },
});

export default NewSaleScreen;

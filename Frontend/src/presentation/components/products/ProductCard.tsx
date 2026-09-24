/**
 * UI Component: ProductCard
 * Tarjeta de producto para el listado del catálogo.
 */

import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Product } from '../../../domain/entities/Product';
import { formatPrice, isLowStock } from '../../../infrastructure/services/productService';

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  delay?: number;
}

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

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  delay = 0,
}) => {
  const slideAnim = useRef(new Animated.Value(24)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 350,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();

  const handlePressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();

  const lowStock = isLowStock(product);
  const icon = CATEGORY_ICONS[product.category] ?? '📦';

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Pressable
        onPress={() => onPress?.(product)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        {/* Ícono de categoría */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        {/* Info principal */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.category}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Text>
        </View>

        {/* Precio y stock */}
        <View style={styles.right}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <View style={[styles.stockBadge, lowStock && styles.stockBadgeLow]}>
            <Text style={[styles.stockText, lowStock && styles.stockTextLow]}>
              {lowStock ? '⚠ ' : ''}Stock: {product.stock}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    gap: 12,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 3,
  },
  category: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#00c9a7',
    letterSpacing: -0.3,
  },
  stockBadge: {
    backgroundColor: '#e6fdf8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stockBadgeLow: {
    backgroundColor: '#fde8f2',
  },
  stockText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00b894',
  },
  stockTextLow: {
    color: '#e84393',
  },
});

export default ProductCard;

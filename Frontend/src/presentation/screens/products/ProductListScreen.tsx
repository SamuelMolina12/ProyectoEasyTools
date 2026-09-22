/**
 * Screen: ProductListScreen — HU-06
 * Catálogo de productos con búsqueda, filtro por categoría y paginación.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import { ProductCard } from '../../components/products/ProductCard';
import { Button } from '../../components/ui/Button';
import { Product, PRODUCT_CATEGORIES, ProductCategory } from '../../../domain/entities/Product';
import {
  mockGetProducts,
} from '../../../infrastructure/services/productService.mock';
import { ProductsStackParamList } from '../../navigation/ProductsNavigator';

type ProductListScreenProps = {
  navigation: NativeStackNavigationProp<ProductsStackParamList, 'ProductList'>;
};

const PAGE_SIZE = 10;

export const ProductListScreen: React.FC<ProductListScreenProps> = ({
  navigation,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Recarga al enfocar la pantalla (después de crear un producto)
  useFocusEffect(
    useCallback(() => {
      loadProducts(1, search, selectedCategory, true);
    }, []),
  );

  const loadProducts = async (
    pageNum: number,
    searchQuery: string,
    category: ProductCategory | 'all',
    reset: boolean = false,
  ) => {
    if (pageNum === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const result = await mockGetProducts(pageNum, PAGE_SIZE, searchQuery, category);
      setTotal(result.total);
      setTotalPages(result.pages);
      setPage(pageNum);

      if (reset || pageNum === 1) {
        setProducts(result.products);
      } else {
        setProducts((prev) => [...prev, ...result.products]);
      }
    } catch {
      // Manejar error en sprints futuros
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Búsqueda con debounce
  const handleSearch = (text: string) => {
    setSearch(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      loadProducts(1, text, selectedCategory, true);
    }, 350);
  };

  const handleCategoryFilter = (cat: ProductCategory | 'all') => {
    setSelectedCategory(cat);
    loadProducts(1, search, cat, true);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && page < totalPages) {
      loadProducts(page + 1, search, selectedCategory);
    }
  };

  const handleProductPress = (product: Product) => {
    // Sprint 2: navegar a detalle/edición
    console.log('Producto seleccionado:', product.name);
  };

  const categories: { label: string; value: ProductCategory | 'all' }[] = [
    { label: 'Todos', value: 'all' },
    ...PRODUCT_CATEGORIES,
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View style={[styles.header, { opacity: headerAnim }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Catálogo</Text>
            <Text style={styles.subtitle}>
              {total} {total === 1 ? 'producto' : 'productos'} registrados
            </Text>
          </View>
          <Button
            label="+ Agregar"
            onPress={() => navigation.navigate('ProductForm')}
            variant="primary"
            size="sm"
            fullWidth={false}
          />
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o categoría..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={handleSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => handleSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Filtros de categoría */}
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {categories.map((cat) => (
            <Pressable
              key={cat.value}
              onPress={() => handleCategoryFilter(cat.value)}
              style={[
                styles.filterChip,
                selectedCategory === cat.value && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === cat.value && styles.filterTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </Animated.ScrollView>
      </Animated.View>

      {/* Lista de productos */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00c9a7" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>
            {search || selectedCategory !== 'all'
              ? 'Sin resultados'
              : 'Sin productos aún'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {search || selectedCategory !== 'all'
              ? 'Intenta con otra búsqueda o categoría'
              : 'Agrega tu primer producto presionando "+ Agregar"'}
          </Text>
          {!search && selectedCategory === 'all' && (
            <View style={styles.emptyButton}>
              <Button
                label="Agregar primer producto"
                onPress={() => navigation.navigate('ProductForm')}
                variant="primary"
                size="md"
              />
            </View>
          )}
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ProductCard
              product={item}
              onPress={handleProductPress}
              delay={Math.min(index * 50, 300)}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color="#00c9a7" />
              </View>
            ) : page < totalPages ? (
              <Pressable
                onPress={handleLoadMore}
                style={styles.loadMoreButton}
              >
                <Text style={styles.loadMoreText}>Cargar más productos</Text>
              </Pressable>
            ) : products.length > 0 ? (
              <Text style={styles.endText}>
                ✓ Todos los productos cargados ({total})
              </Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a2e',
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '700',
    padding: 2,
  },
  filtersContainer: {
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#00c9a7',
    borderColor: '#00c9a7',
  },
  filterText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 16,
    width: '100%',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadMoreButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  loadMoreText: {
    color: '#00c9a7',
    fontWeight: '700',
    fontSize: 14,
  },
  endText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 12,
    paddingVertical: 16,
    fontWeight: '500',
  },
});

export default ProductListScreen;

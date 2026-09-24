/**
 * Screen: SalesHistoryScreen
 * Historial de ventas del negocio con detalle de cada una.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ventaService } from '../../../infrastructure/services/ventaService';
import { Sale } from '../../../domain/entities/Sale';

const formatCurrency = (v: number) => `$${Number(v).toLocaleString('es-CO')}`;
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const SalesHistoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadSales = useCallback(async (p: number, append = false) => {
    try {
      if (p === 1) setLoading(true);
      else setLoadingMore(true);
      const res = await ventaService.getVentas(p, 20);
      setSales((prev) => (append ? [...prev, ...res.sales] : res.sales));
      setTotalPages(res.pages);
    } catch {
      // ignorar
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadSales(1);
  }, []);

  const loadMore = () => {
    if (page < totalPages && !loadingMore) {
      const next = page + 1;
      setPage(next);
      loadSales(next, true);
    }
  };

  const renderSale = ({ item }: { item: Sale }) => {
    const isExpanded = expandedId === item.id;
    const estadoColor = item.estado === 'completada' ? '#00c9a7' : '#ef4444';

    return (
      <Pressable
        style={styles.saleCard}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        <View style={styles.saleCardHeader}>
          <View>
            <Text style={styles.saleId}>Venta #{item.id}</Text>
            <Text style={styles.saleDate}>{formatDate(item.fecha_venta)}</Text>
          </View>
          <View style={styles.saleRight}>
            <Text style={styles.saleTotal}>{formatCurrency(item.total)}</Text>
            <View style={[styles.estadoBadge, { backgroundColor: estadoColor + '20', borderColor: estadoColor }]}>
              <Text style={[styles.estadoText, { color: estadoColor }]}>{item.estado}</Text>
            </View>
          </View>
        </View>

        {/* Detalles expandibles */}
        {isExpanded && (
          <View style={styles.saleDetails}>
            <View style={styles.detailsDivider} />
            {item.detalles.map((d) => (
              <View key={d.id} style={styles.detailRow}>
                <Text style={styles.detailName} numberOfLines={1}>
                  {d.producto_nombre || `Producto #${d.producto_id}`}
                </Text>
                <Text style={styles.detailQty}>{d.cantidad}x</Text>
                <Text style={styles.detailSubtotal}>{formatCurrency(d.subtotal)}</Text>
              </View>
            ))}
            <View style={styles.detailTotalRow}>
              <Text style={styles.detailTotalLabel}>Total</Text>
              <Text style={styles.detailTotalValue}>{formatCurrency(item.total)}</Text>
            </View>
          </View>
        )}

        <Text style={styles.expandHint}>{isExpanded ? '▲ Ocultar' : '▼ Ver detalles'}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de Ventas</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00c9a7" style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={sales}
          keyExtractor={(s) => String(s.id)}
          renderItem={renderSale}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Sin ventas registradas</Text>
              <Text style={styles.emptyText}>Las ventas que registres aparecerán aquí</Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color="#00c9a7" style={{ padding: 16 }} /> : null
          }
        />
      )}
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
  list: { padding: 16, gap: 12 },
  saleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  saleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  saleId: { fontSize: 15, fontWeight: '800', color: '#1a1a2e' },
  saleDate: { fontSize: 12, color: '#94a3b8', fontWeight: '500', marginTop: 2 },
  saleRight: { alignItems: 'flex-end', gap: 6 },
  saleTotal: { fontSize: 18, fontWeight: '800', color: '#00c9a7' },
  estadoBadge: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  estadoText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  expandHint: { fontSize: 11, color: '#94a3b8', fontWeight: '500', marginTop: 10, textAlign: 'center' },
  saleDetails: { marginTop: 8 },
  detailsDivider: { height: 1, backgroundColor: '#e2e8f0', marginBottom: 10 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    gap: 8,
  },
  detailName: { flex: 1, fontSize: 13, color: '#1a1a2e', fontWeight: '600' },
  detailQty: { fontSize: 13, color: '#64748b', fontWeight: '600', width: 32, textAlign: 'center' },
  detailSubtotal: { fontSize: 13, fontWeight: '700', color: '#1a1a2e', width: 80, textAlign: 'right' },
  detailTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    marginTop: 4,
  },
  detailTotalLabel: { fontSize: 14, fontWeight: '800', color: '#1a1a2e' },
  detailTotalValue: { fontSize: 15, fontWeight: '800', color: '#00c9a7' },
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 52, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a2e', marginBottom: 6 },
  emptyText: { fontSize: 14, color: '#94a3b8', fontWeight: '500', textAlign: 'center' },
});

export default SalesHistoryScreen;

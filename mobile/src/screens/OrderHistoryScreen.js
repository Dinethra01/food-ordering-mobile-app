import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { getOrdersApi, cancelOrderApi, updateOrderStatusApi } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const STATUS_FILTERS = ['All', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const STATUS_STEPS = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

const STATUS_CONFIG = {
  Pending: {
    bg: '#451A03',
    text: '#FDBA74',
    border: '#F97316',
    stepTitle: 'Order Placed',
    icon: '📝',
  },
  Preparing: {
    bg: '#1E3A8A',
    text: '#93C5FD',
    border: '#3B82F6',
    stepTitle: 'In Kitchen',
    icon: '🍳',
  },
  'Out for Delivery': {
    bg: '#3B0764',
    text: '#E9D5FF',
    border: '#A855F7',
    stepTitle: 'On the Way',
    icon: '🛵',
  },
  Delivered: {
    bg: '#064E3B',
    text: '#A7F3D0',
    border: '#10B981',
    stepTitle: 'Delivered',
    icon: '✅',
  },
  Cancelled: {
    bg: '#7F1D1D',
    text: '#FCA5A5',
    border: '#EF4444',
    stepTitle: 'Cancelled',
    icon: '❌',
  },
};

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useContext(AuthContext);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrdersApi();
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Could not load order history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleCancelOrder = (orderId) => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this pending order?', [
      { text: 'No, Keep', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelOrderApi(orderId);
            Alert.alert('Success', 'Order cancelled and item stock restored.');
            fetchOrders();
          } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to cancel order.');
          }
        },
      },
    ]);
  };

  const handleUpdateStatus = (orderId, currentStatus) => {
    const nextStatusMap = {
      Pending: 'Preparing',
      Preparing: 'Out for Delivery',
      'Out for Delivery': 'Delivered',
    };

    const nextStatus = nextStatusMap[currentStatus];
    if (!nextStatus) return;

    Alert.alert(
      'Advance Pipeline',
      `Advance order status from '${currentStatus}' ➔ '${nextStatus}'?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Advance Status',
          onPress: async () => {
            try {
              await updateOrderStatusApi(orderId, nextStatus);
              fetchOrders();
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to update status.');
            }
          },
        },
      ]
    );
  };

  // Filter and search logic
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = activeFilter === 'All' || order.orderStatus === activeFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      order.deliveryAddress?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      order.items?.some((i) =>
        i.foodItemId?.name?.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );

    return matchesFilter && matchesSearch;
  });

  // Calculate counts for chips
  const getFilterCount = (filter) => {
    if (filter === 'All') return orders.length;
    return orders.filter((o) => o.orderStatus === filter).length;
  };

  const renderPipelineTracker = (order) => {
    if (order.orderStatus === 'Cancelled') {
      return (
        <View style={styles.cancelledBanner}>
          <Text style={styles.cancelledBannerText}>
            ❌ Order Cancelled (Items returned to menu stock)
          </Text>
        </View>
      );
    }

    const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);

    return (
      <View style={styles.trackerContainer}>
        <View style={styles.trackerLineBackground} />
        <View
          style={[
            styles.trackerLineFill,
            {
              width:
                currentStepIndex <= 0
                  ? '0%'
                  : `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
            },
          ]}
        />

        <View style={styles.stepsRow}>
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <View key={step} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCircleCompleted,
                    isCurrent && styles.stepCircleCurrent,
                  ]}
                >
                  <Text style={[styles.stepCircleText, isCompleted && styles.stepCircleTextCompleted]}>
                    {isCompleted ? '✓' : idx + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isCurrent && styles.stepLabelCurrent,
                    isCompleted && styles.stepLabelCompleted,
                  ]}
                  numberOfLines={1}
                >
                  {STATUS_CONFIG[step]?.stepTitle || step}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderOrderItem = ({ item }) => {
    const statusConfig = STATUS_CONFIG[item.orderStatus] || STATUS_CONFIG.Pending;
    const dateFormatted = new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.orderCard}>
        {/* Header */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderIdText}>
              Order #{item._id.substring(item._id.length - 6).toUpperCase()}
            </Text>
            <Text style={styles.orderDateText}>{dateFormatted}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusConfig.bg, borderColor: statusConfig.border },
            ]}
          >
            <Text style={[styles.statusText, { color: statusConfig.text }]}>
              {statusConfig.icon} {item.orderStatus}
            </Text>
          </View>
        </View>

        {/* Visual Pipeline Tracker (Website Parity) */}
        {renderPipelineTracker(item)}

        <View style={styles.divider} />

        {/* Ordered Items List */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionHeader}>ITEMS ORDERED</Text>
          {item.items.map((sub, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemNameText}>
                {sub.quantity}x {sub.foodItemId?.name || 'Food Item'}
              </Text>
              <Text style={styles.itemPriceText}>
                ${((sub.price || 0) * sub.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Address and Total */}
        <View style={styles.orderFooter}>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>DELIVERY ADDRESS</Text>
            <Text style={styles.addressText} numberOfLines={2}>
              📍 {item.deliveryAddress || 'Standard Delivery'}
            </Text>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>${Number(item.totalAmount).toFixed(2)}</Text>
            <Text style={styles.paymentMethodText}>Cash on Delivery</Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.actionRow}>
          {item.orderStatus === 'Pending' && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleCancelOrder(item._id)}
            >
              <Text style={styles.cancelBtnText}>✕ Cancel Order</Text>
            </TouchableOpacity>
          )}

          {user?.role === 'admin' && ['Pending', 'Preparing', 'Out for Delivery'].includes(item.orderStatus) && (
            <TouchableOpacity
              style={styles.statusUpdateBtn}
              onPress={() => handleUpdateStatus(item._id, item.orderStatus)}
            >
              <Text style={styles.statusUpdateBtnText}>Advance Pipeline ➔</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Tracking & History 📜</Text>
        <Text style={styles.headerSubtitle}>Synchronized live with Website and Atlas</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search orders by ID, meal name or address..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Status Filter Chips (Website Parity) */}
      <View style={styles.filtersWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={STATUS_FILTERS}
          keyExtractor={(item) => item}
          renderItem={({ item: filter }) => {
            const count = getFilterCount(filter);
            const isActive = activeFilter === filter;

            return (
              <TouchableOpacity
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {filter}
                </Text>
                <View style={[styles.chipBadge, isActive && styles.chipBadgeActive]}>
                  <Text style={[styles.chipBadgeText, isActive && styles.chipBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Main Order List */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Fetching orders...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B00" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>No orders match your filter</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || activeFilter !== 'All'
                  ? 'Try changing the active status chip or clearing search'
                  : 'Your placed food orders will appear here in real time.'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    color: '#FFF',
    fontSize: 13,
    borderColor: '#334155',
    borderWidth: 1,
  },
  filtersWrapper: {
    paddingVertical: 10,
    paddingLeft: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterChipActive: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  filterChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  chipBadge: {
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  chipBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  chipBadgeText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
  },
  chipBadgeTextActive: {
    color: '#FFF',
  },
  listContent: {
    padding: 16,
    gap: 14,
  },
  orderCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderIdText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 15,
  },
  orderDateText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 11,
  },

  /* Visual Pipeline Tracker */
  trackerContainer: {
    marginTop: 16,
    marginBottom: 8,
    position: 'relative',
  },
  trackerLineBackground: {
    position: 'absolute',
    top: 14,
    left: '12%',
    right: '12%',
    height: 3,
    backgroundColor: '#334155',
    zIndex: 1,
  },
  trackerLineFill: {
    position: 'absolute',
    top: 14,
    left: '12%',
    height: 3,
    backgroundColor: '#FF6B00',
    zIndex: 2,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 3,
  },
  stepItem: {
    alignItems: 'center',
    width: '24%',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepCircleCompleted: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  stepCircleCurrent: {
    borderColor: '#FF6B00',
    borderWidth: 2,
  },
  stepCircleText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  stepCircleTextCompleted: {
    color: '#FFF',
    fontWeight: '800',
  },
  stepLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepLabelCompleted: {
    color: '#CBD5E1',
  },
  stepLabelCurrent: {
    color: '#FF6B00',
    fontWeight: '700',
  },
  cancelledBanner: {
    backgroundColor: '#7F1D1D',
    borderRadius: 8,
    padding: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  cancelledBannerText: {
    color: '#FECACA',
    fontSize: 11,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  sectionHeader: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  itemsSection: {
    gap: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemNameText: {
    color: '#E2E8F0',
    fontSize: 13,
    flex: 1,
  },
  itemPriceText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressBox: {
    flex: 1,
    marginRight: 12,
  },
  addressLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  addressText: {
    color: '#E2E8F0',
    fontSize: 12,
    marginTop: 2,
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  totalValue: {
    color: '#10B981',
    fontWeight: '800',
    fontSize: 18,
    marginTop: 2,
  },
  paymentMethodText: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  cancelBtn: {
    backgroundColor: '#7F1D1D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cancelBtnText: {
    color: '#FECACA',
    fontWeight: '700',
    fontSize: 12,
  },
  statusUpdateBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusUpdateBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default OrderHistoryScreen;

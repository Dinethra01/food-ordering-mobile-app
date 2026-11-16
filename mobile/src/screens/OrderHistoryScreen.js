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
} from 'react-native';
import { getOrdersApi, cancelOrderApi, updateOrderStatusApi } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const STATUS_COLORS = {
  Pending: { bg: '#451A03', text: '#FDBA74', border: '#F97316' },
  Preparing: { bg: '#1E3A8A', text: '#93C5FD', border: '#3B82F6' },
  'Out for Delivery': { bg: '#3B0764', text: '#E9D5FF', border: '#A855F7' },
  Delivered: { bg: '#064E3B', text: '#A7F3D0', border: '#10B981' },
  Cancelled: { bg: '#7F1D1D', text: '#FCA5A5', border: '#EF4444' },
};

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useContext(AuthContext);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrdersApi();
      setOrders(response.data.data);
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
      { text: 'No', style: 'cancel' },
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

    Alert.alert('Update Status', `Advance status from '${currentStatus}' to '${nextStatus}'?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Update',
        onPress: async () => {
          try {
            await updateOrderStatusApi(orderId, nextStatus);
            fetchOrders();
          } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update status.');
          }
        },
      },
    ]);
  };

  const renderOrderItem = ({ item }) => {
    const statusStyle = STATUS_COLORS[item.orderStatus] || STATUS_COLORS.Pending;
    const dateFormatted = new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderIdText}>Order #{item._id.substring(item._id.length - 6)}</Text>

            <Text style={styles.orderDateText}>{dateFormatted}</Text>

          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.bg, borderColor: statusStyle.border },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.orderStatus}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Ordered Items List */}
        <View style={styles.itemsSection}>
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

        <View style={styles.orderFooter}>
          <View>
            <Text style={styles.addressLabel}>Delivery Address:</Text>
            <Text style={styles.addressText} numberOfLines={1}>
              📍 {item.deliveryAddress}
            </Text>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>

            <Text style={styles.totalValue}>${Number(item.totalAmount).toFixed(2)}</Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.actionRow}>
          {item.orderStatus === 'Pending' && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleCancelOrder(item._id)}
            >
              <Text style={styles.cancelBtnText}>Cancel Order</Text>

            </TouchableOpacity>
          )}

          {user?.role === 'admin' && ['Pending', 'Preparing', 'Out for Delivery'].includes(item.orderStatus) && (
            <TouchableOpacity
              style={styles.statusUpdateBtn}
              onPress={() => handleUpdateStatus(item._id, item.orderStatus)}
            >
              <Text style={styles.statusUpdateBtnText}>Advance Status ➔</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Order History 📜</Text>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />

          <Text style={styles.loadingText}>Fetching orders...</Text>

        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B00" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>

              <Text style={styles.emptyTitle}>No past orders found</Text>

              <Text style={styles.emptySubtitle}>Your order history will appear here.</Text>

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
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  listContent: {
    padding: 16,
    gap: 16,
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
    alignItems: 'center',
  },
  orderIdText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  orderDateText: {
    color: '#94A3B8',
    fontSize: 12,
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
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  itemsSection: {
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemNameText: {
    color: '#E2E8F0',
    fontSize: 14,
  },
  itemPriceText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressLabel: {
    color: '#64748B',
    fontSize: 11,
  },
  addressText: {
    color: '#CBD5E1',
    fontSize: 12,
    maxWidth: 200,
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  totalValue: {
    color: '#10B981',
    fontWeight: '800',
    fontSize: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  cancelBtn: {
    backgroundColor: '#7F1D1D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelBtnText: {
    color: '#FCA5A5',
    fontWeight: '600',
    fontSize: 12,
  },
  statusUpdateBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusUpdateBtnText: {
    color: '#FFF',
    fontWeight: '600',
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
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#64748B',
    marginTop: 4,
  },
});

export default OrderHistoryScreen;

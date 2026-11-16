import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Alert,
} from 'react-native';
import { getFoodItemsApi, getOrdersApi, updateOrderStatusApi } from '../services/api';
import { formatLKR } from '../utils/currency';

const AdminDashboardScreen = ({ navigation }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [foodRes, ordersRes] = await Promise.all([
        getFoodItemsApi(),
        getOrdersApi(),
      ]);

      if (foodRes.data.success) {
        setFoodItems(foodRes.data.data);
      }
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.data);
      }
    } catch (err) {
      console.error('Admin dashboard fetch error:', err);
      Alert.alert('Error', 'Could not load admin analytics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDashboardData();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleAdvanceStatus = async (orderId, currentStatus) => {
    const nextStatusMap = {
      Pending: 'Preparing',
      Preparing: 'Out for Delivery',
      'Out for Delivery': 'Delivered',
    };

    const nextStatus = nextStatusMap[currentStatus];
    if (!nextStatus) return;

    Alert.alert('Advance Order Status', `Update order from '${currentStatus}' to '${nextStatus}'?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          try {
            await updateOrderStatusApi(orderId, nextStatus);
            Alert.alert('Success', `Status changed to ${nextStatus}!`);
            fetchDashboardData();
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to update order');
          }
        },
      },
    ]);
  };

  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
  const inStockItems = foodItems.filter((i) => i.isAvailable && i.stockQuantity > 0).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B00" />}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Admin Analytics 📊</Text>
            <Text style={styles.subtitle}>Mobile & Web Synchronized Operations</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddFoodItem')}
          >
            <Text style={styles.addBtnText}>+ Add Dish</Text>
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#FF6B00" />
            <Text style={styles.loadingText}>Fetching analytics...</Text>
          </View>
        ) : (
          <>
            {/* 4 Metric Cards */}
            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, { borderLeftColor: '#10B981' }]}>
                <Text style={styles.metricLabel}>GROSS REVENUE</Text>
                <Text style={[styles.metricValue, { color: '#10B981' }]}>{formatLKR(totalRevenue)}</Text>
                <Text style={styles.metricSub}>From confirmed orders</Text>
              </View>

              <View style={[styles.metricCard, { borderLeftColor: '#FF6B00' }]}>
                <Text style={styles.metricLabel}>TOTAL ORDERS</Text>
                <Text style={[styles.metricValue, { color: '#FFF' }]}>{orders.length}</Text>
                <Text style={styles.metricSub}>Placed on web & mobile</Text>
              </View>

              <View style={[styles.metricCard, { borderLeftColor: '#F59E0B' }]}>
                <Text style={styles.metricLabel}>PENDING ORDERS</Text>
                <Text style={[styles.metricValue, { color: '#F59E0B' }]}>{pendingOrders}</Text>
                <Text style={styles.metricSub}>Awaiting kitchen prep</Text>
              </View>

              <View style={[styles.metricCard, { borderLeftColor: '#6366F1' }]}>
                <Text style={styles.metricLabel}>MENU ITEMS</Text>
                <Text style={[styles.metricValue, { color: '#818CF8' }]}>{foodItems.length}</Text>
                <Text style={styles.metricSub}>{inStockItems} ready in stock</Text>
              </View>
            </View>

            {/* Recent Orders Section */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Orders Pipeline</Text>
                <TouchableOpacity onPress={() => navigation.navigate('OrdersTab')}>
                  <Text style={styles.viewAllText}>View All ➔</Text>
                </TouchableOpacity>
              </View>

              {orders.slice(0, 5).map((order) => {
                const canAdvance = ['Pending', 'Preparing', 'Out for Delivery'].includes(order.orderStatus);
                const nextStatusMap = {
                  Pending: 'Preparing',
                  Preparing: 'Out for Delivery',
                  'Out for Delivery': 'Delivered',
                };

                return (
                  <View key={order._id} style={styles.orderRow}>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderId}>
                        #{order._id.substring(order._id.length - 6).toUpperCase()}
                      </Text>
                      <Text style={styles.orderCustomer}>
                        {order.userId?.name || 'Customer'} • {formatLKR(order.totalAmount)}
                      </Text>
                      <Text style={styles.orderStatusBadge}>
                        Status: {order.orderStatus}
                      </Text>
                    </View>

                    {canAdvance ? (
                      <TouchableOpacity
                        style={styles.advanceBtn}
                        onPress={() => handleAdvanceStatus(order._id, order.orderStatus)}
                      >
                        <Text style={styles.advanceBtnText}>
                          ➔ {nextStatusMap[order.orderStatus]}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.finishedText}>
                        {order.orderStatus === 'Delivered' ? '✓ Delivered' : '✕ Cancelled'}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#FF6B00',
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  metricsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    borderLeftWidth: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    marginVertical: 4,
  },
  metricSub: {
    fontSize: 11,
    color: '#64748B',
  },
  sectionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  viewAllText: {
    color: '#FF6B00',
    fontSize: 12,
    fontWeight: '600',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  orderCustomer: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  orderStatusBadge: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  advanceBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  advanceBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  finishedText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  loadingBox: {
    padding: 60,
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
  },
});

export default AdminDashboardScreen;

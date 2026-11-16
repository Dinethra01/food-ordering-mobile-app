import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getOrdersApi } from '../services/api';
import { API_BASE_URL, getStoredBackendUrl } from '../config/apiConfig';
import { formatLKR } from '../utils/currency';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverUrl, setServerUrl] = useState(API_BASE_URL);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const activeUrl = await getStoredBackendUrl();
        setServerUrl(activeUrl);
        const response = await getOrdersApi();
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching user stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const totalSpent = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const activeOrders = orders.filter((o) =>
    ['Pending', 'Preparing', 'Out for Delivery'].includes(o.orderStatus)
  ).length;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of FoodieExpress?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>My Profile 👤</Text>

        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user?.name || 'Customer'}</Text>
              <View style={[styles.roleBadge, isAdmin ? styles.adminBadge : styles.customerBadge]}>
                <Text style={[styles.roleBadgeText, isAdmin ? styles.adminBadgeText : styles.customerBadgeText]}>
                  {isAdmin ? 'Admin Staff 👑' : 'Customer 🍔'}
                </Text>
              </View>
            </View>

            <Text style={styles.userEmail}>{user?.email || 'N/A'}</Text>
            <Text style={styles.memberTag}>Foodie Member since 2026</Text>
          </View>
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📦</Text>
            <Text style={styles.statValue}>{loading ? '...' : orders.length}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💵</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>
              {loading ? '...' : formatLKR(totalSpent)}
            </Text>
            <Text style={styles.statLabel}>Lifetime Spent</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={[styles.statValue, { color: '#FF6B00' }]}>
              {loading ? '...' : activeOrders}
            </Text>
            <Text style={styles.statLabel}>In Kitchen</Text>
          </View>
        </View>

        {/* Action Shortcuts */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Quick Navigation</Text>

          <TouchableOpacity
            style={styles.navRow}
            onPress={() => navigation.navigate('OrdersTab')}
          >
            <View style={styles.navRowLeft}>
              <Text style={styles.navRowIcon}>📜</Text>
              <View>
                <Text style={styles.navRowTitle}>View Order History</Text>
                <Text style={styles.navRowSubtitle}>Track active & past orders</Text>
              </View>
            </View>
            <Text style={styles.chevron}>➔</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navRow}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <View style={styles.navRowLeft}>
              <Text style={styles.navRowIcon}>🍔</Text>
              <View>
                <Text style={styles.navRowTitle}>Browse Food Menu</Text>
                <Text style={styles.navRowSubtitle}>Explore all delicious dishes</Text>
              </View>
            </View>
            <Text style={styles.chevron}>➔</Text>
          </TouchableOpacity>

          {isAdmin && (
            <TouchableOpacity
              style={[styles.navRow, styles.adminNavRow]}
              onPress={() => navigation.navigate('AdminDashboard')}
            >
              <View style={styles.navRowLeft}>
                <Text style={styles.navRowIcon}>📊</Text>
                <View>
                  <Text style={[styles.navRowTitle, { color: '#818CF8' }]}>
                    Admin Dashboard & Analytics
                  </Text>
                  <Text style={styles.navRowSubtitle}>Platform sales & order fulfillment</Text>
                </View>
              </View>
              <Text style={[styles.chevron, { color: '#818CF8' }]}>➔</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Server Connection Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🌐 Connected Backend Server</Text>
          <Text style={styles.infoValue} numberOfLines={1}>{serverUrl}</Text>
          <Text style={styles.infoHint}>Synchronized with MongoDB Atlas & Website</Text>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sign Out from FoodieExpress</Text>
        </TouchableOpacity>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 20,
    marginTop: 4,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  customerBadge: {
    backgroundColor: '#064E3B',
  },
  customerBadgeText: {
    color: '#A7F3D0',
    fontSize: 10,
    fontWeight: '700',
  },
  adminBadge: {
    backgroundColor: '#312E81',
  },
  adminBadgeText: {
    color: '#C7D2FE',
    fontSize: 10,
    fontWeight: '700',
  },
  userEmail: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 4,
  },
  memberTag: {
    color: '#64748B',
    fontSize: 11,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  adminNavRow: {
    borderBottomWidth: 0,
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  navRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navRowIcon: {
    fontSize: 20,
  },
  navRowTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  navRowSubtitle: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  chevron: {
    color: '#94A3B8',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 11,
    color: '#FF6B00',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  infoHint: {
    fontSize: 10,
    color: '#64748B',
  },
  logoutButton: {
    backgroundColor: '#7F1D1D',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  logoutButtonText: {
    color: '#FECACA',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default ProfileScreen;

import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Alert,
} from 'react-native';
import { getFoodItemsApi, deleteFoodItemApi } from '../services/api';
import { getImageUrl } from '../config/apiConfig';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const CATEGORIES = ['All', 'Main Course', 'Starters', 'Desserts', 'Beverages'];

const HomeScreen = ({ navigation }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { user, logout } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const fetchFoodItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await getFoodItemsApi(params);
      setFoodItems(response.data.data);
    } catch (error) {
      console.error('Error fetching food items:', error);
      Alert.alert('Error', 'Could not load food items from server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFoodItems();
    });
    return unsubscribe;
  }, [navigation, fetchFoodItems]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFoodItems();
  };

  const handleDeleteFoodItem = (id, name) => {
    Alert.alert('Delete Food Item', `Are you sure you want to delete '${name}'?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteFoodItemApi(id);
            Alert.alert('Success', `'${name}' removed from menu.`);
            fetchFoodItems();
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to delete item');
          }
        },
      },
    ]);
  };

  const renderFoodCard = ({ item }) => {
    const isOutOfStock = !item.isAvailable || item.stockQuantity <= 0;

    return (
      <View style={styles.card}>
        {/* Fixed aspect compact thumbnail - prevents oversized banner stretching */}
        <Image
          source={{ uri: getImageUrl(item.image) }}
          style={styles.cardImageThumbnail}
          resizeMode="cover"
        />

        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.cardPrice}>${Number(item.price).toFixed(2)}</Text>
          </View>

          <Text style={styles.categoryTag}>Category: {item.category}</Text>

          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.cardFooter}>
            <View
              style={[
                styles.stockBadge,
                isOutOfStock ? styles.outOfStockBadge : styles.inStockBadge,
              ]}
            >
              <Text style={styles.stockBadgeText}>
                {isOutOfStock ? 'Out of Stock' : `Stock: ${item.stockQuantity}`}
              </Text>
            </View>

            {/* Customer Add to Cart button */}
            <TouchableOpacity
              style={[styles.addButton, isOutOfStock && styles.addButtonDisabled]}
              disabled={isOutOfStock}
              onPress={() => {
                addToCart(item);
                Alert.alert('Added to Cart 🛒', `${item.name} added to your order!`);
              }}
            >
              <Text style={styles.addButtonText}>
                {isOutOfStock ? 'Unavailable' : '+ Add'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Admin CRUD Action Controls (Edit & Delete) */}
          {user?.role === 'admin' && (
            <View style={styles.adminBar}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('AddFoodItem', { item })}
              >
                <Text style={styles.editBtnText}>✏️ Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteFoodItem(item._id, item.name)}
              >
                <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.welcomeText}>Hello, {user?.name || 'Guest'} 👋</Text>
          <Text style={styles.roleTag}>
            Role: {user?.role === 'admin' ? 'Admin Staff 👑' : 'Customer 🍔'}
          </Text>
        </View>

        <View style={styles.topRightActions}>
          {user?.role === 'admin' && (
            <TouchableOpacity
              style={styles.adminAddBtn}
              onPress={() => navigation.navigate('AddFoodItem')}
            >
              <Text style={styles.adminAddBtnText}>+ New Item</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search burgers, pizzas, drinks..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Pills */}
      <View style={styles.categoryRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(cat) => cat}
          renderItem={({ item: cat }) => (
            <TouchableOpacity
              style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  selectedCategory === cat && styles.categoryPillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Main Food List */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      ) : (
        <FlatList
          data={foodItems}
          keyExtractor={(item) => item._id}
          renderItem={renderFoodCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B00" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No food items found</Text>
              <Text style={styles.emptySubtitle}>Try changing category or search keyword</Text>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  roleTag: {
    fontSize: 12,
    color: '#FF6B00',
    marginTop: 2,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminAddBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  adminAddBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  logoutBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutBtnText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  searchInput: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 14,
    borderColor: '#334155',
    borderWidth: 1,
  },
  categoryRow: {
    marginVertical: 12,
    paddingLeft: 16,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryPillActive: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  categoryPillText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 13,
  },
  categoryPillTextActive: {
    color: '#FFF',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  /* Sleek modern horizontal card layout */
  card: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  cardImageThumbnail: {
    width: 105,
    height: 105,
    borderRadius: 10,
    backgroundColor: '#0F172A',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    flex: 1,
    marginRight: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  categoryTag: {
    color: '#FF6B00',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  cardDescription: {
    color: '#94A3B8',
    fontSize: 12,
    marginVertical: 6,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  inStockBadge: {
    backgroundColor: '#064E3B',
  },
  outOfStockBadge: {
    backgroundColor: '#7F1D1D',
  },
  stockBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#475569',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  adminBar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    justifyContent: 'flex-end',
  },
  editBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: '#991B1B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: '#FECACA',
    fontSize: 11,
    fontWeight: '700',
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

export default HomeScreen;

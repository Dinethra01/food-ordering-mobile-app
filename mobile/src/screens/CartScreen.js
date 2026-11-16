import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { CartContext } from '../context/CartContext';
import { createOrderApi } from '../services/api';
import { getImageUrl } from '../config/apiConfig';
import { formatLKR } from '../utils/currency';

const CartScreen = ({ navigation }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } =
    useContext(CartContext);

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add some food items to your cart first.');
      return;
    }

    if (!deliveryAddress.trim()) {
      Alert.alert('Required Field', 'Please enter your delivery address before placing order.');
      return;
    }

    setLoading(true);

    try {
      // Build order payload matching backend requirements
      const payload = {
        items: cartItems.map((item) => ({
          foodItemId: item.foodItem._id,
          quantity: item.quantity,
        })),
        deliveryAddress: deliveryAddress.trim(),
        paymentMethod: 'Cash on Delivery',
      };

      const response = await createOrderApi(payload);
      setLoading(false);

      if (response.data.success) {
        Alert.alert(
          'Order Placed! 🎉',
          `Your order has been successfully placed!\nTotal: ${formatLKR(response.data.data.totalAmount)}`,
          [
            {
              text: 'View Order History',
              onPress: () => {
                clearCart();
                setDeliveryAddress('');
                navigation.navigate('OrdersTab');
              },
            },
          ]
        );
      }
    } catch (error) {
      setLoading(false);
      console.error('Checkout error:', error);
      const serverMessage = error.response?.data?.message || 'Failed to place order.';

      // Handles business logic failure response from backend (e.g. Out of stock)
      Alert.alert('Order Failed ⚠️', serverMessage);
    }
  };

  const renderCartItem = ({ item }) => {
    const itemTotal = item.foodItem.price * item.quantity;

    return (
      <View style={styles.cartCard}>
        <Image
          source={{ uri: getImageUrl(item.foodItem.image) }}
          style={styles.itemImage}
        />

        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.foodItem.name}</Text>
          <Text style={styles.itemPrice}>{formatLKR(item.foodItem.price)} each</Text>

          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.foodItem._id, -1)}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.foodItem._id, 1)}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>

            <Text style={styles.subtotalText}>{formatLKR(itemTotal)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => removeFromCart(item.foodItem._id)}
        >
          <Text style={styles.removeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Shopping Cart 🛒</Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartIcon}>🛍️</Text>

          <Text style={styles.emptyCartText}>Your cart is empty</Text>

          <Text style={styles.emptyCartSubtext}>Browse menu and pick something delicious!</Text>

          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Text style={styles.browseBtnText}>Explore Menu</Text>

          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.foodItem._id}
            renderItem={renderCartItem}
            scrollEnabled={false}
          />

          <View style={styles.addressContainer}>
            <Text style={styles.label}>Delivery Address *</Text>
            <TextInput
              style={styles.addressInput}
              placeholder="Enter full street address and building no."
              placeholderTextColor="#94A3B8"
              multiline
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
            />
          </View>

          {/* Checkout Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatLKR(getCartTotal())}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>FREE</Text>

            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>{formatLKR(getCartTotal())}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.checkoutBtnText}>Place Order ({formatLKR(getCartTotal())})</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContent: {
    padding: 16,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  itemPrice: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  qtyBtn: {
    backgroundColor: '#334155',
    width: 26,
    height: 26,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 15,
  },
  qtyText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  subtotalText: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 'auto',
  },
  removeBtn: {
    padding: 8,
  },
  removeBtnText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
  addressContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 6,
  },
  addressInput: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    color: '#FFF',
    fontSize: 14,
    height: 70,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#94A3B8',
    fontSize: 14,
  },
  summaryValue: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
    marginTop: 6,
    marginBottom: 16,
  },
  totalLabel: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  totalValue: {
    color: '#FF6B00',
    fontWeight: '800',
    fontSize: 18,
  },
  checkoutBtn: {
    backgroundColor: '#FF6B00',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCartIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyCartText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  emptyCartSubtext: {
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },
  browseBtn: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  browseBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

export default CartScreen;

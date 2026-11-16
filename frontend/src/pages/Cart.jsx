import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrderApi, getImageUrl } from '../services/api';
import {
  IconPlus,
  IconMinus,
  IconTrash,
  IconArrowRight,
  IconShield,
  IconCheckCircle,
  IconTruck,
  IconMapPin,
} from '../components/common/Icons';
import { formatLKR } from '../utils/currency';

export const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [customerNotes, setCustomerNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = getCartTotal();
  const deliveryFee = 0.0; // FREE
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    if (cartItems.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    if (!deliveryAddress.trim()) {
      setError('Please provide a full delivery address to receive your order.');
      return;
    }

    setLoading(true);

    try {
      // Build payload strictly adhering to backend requirements
      const payload = {
        items: cartItems.map((item) => ({
          foodItemId: item.foodItem._id,
          quantity: item.quantity,
        })),
        deliveryAddress: deliveryAddress.trim() + (customerNotes.trim() ? ` (Note: ${customerNotes.trim()})` : ''),
        paymentMethod: paymentMethod || 'Cash on Delivery',
      };

      const response = await createOrderApi(payload);

      if (response.data.success) {
        setPlacedOrder(response.data.data);
        clearCart();
      }
    } catch (err) {
      console.error('Order placement error:', err);
      const serverMessage = err.response?.data?.message || 'Could not place order. Please try again.';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  // If order was successfully placed, render celebration view
  if (placedOrder) {
    return (
      <div className="container" style={{ padding: '60px 20px', maxWidth: '640px' }}>
        <div
          className="card"
          style={{
            padding: '48px 32px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
            borderTop: '5px solid var(--success)',
          }}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '36px',
            }}
          >
            🎉
          </div>

          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '24px' }}>
            Thank you, <strong>{user?.name || 'Customer'}</strong>! The kitchen has received your order and is preparing it right now.
          </p>

          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Order Reference:</span>
              <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                #{placedOrder._id?.substring(placedOrder._id.length - 8).toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Status:</span>
              <span className="status-badge status-pending">{placedOrder.orderStatus}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Amount:</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--success)' }}>
                {formatLKR(placedOrder.totalAmount)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Delivery Address:</span>
              <span style={{ fontWeight: 600, maxWidth: '240px', textAlign: 'right' }}>
                {placedOrder.deliveryAddress}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <Link to="/orders" className="btn btn-primary">
              Track in My Orders
            </Link>
            <Link to="/menu" className="btn btn-secondary">
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', maxWidth: '600px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '50px 30px' }}>
          <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>🛍️</span>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Your Shopping Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
            Discover our wide range of mouth-watering burgers, pizzas, and desserts to fill your cart.
          </p>
          <Link to="/menu" className="btn btn-primary btn-lg">
            Explore Menu Now <IconArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Checkout & Order</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Review your delicious items and provide your delivery details.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column: Cart items & Delivery Details */}
          <div>
            {/* Cart Items List Card */}
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Ordered Items ({cartItems.length})</h3>
                <button
                  onClick={clearCart}
                  style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  Clear Cart
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cartItems.map(({ foodItem, quantity }) => {
                  const itemTotal = Number(foodItem.price) * quantity;
                  return (
                    <div
                      key={foodItem._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        paddingBottom: '16px',
                        borderBottom: '1px solid var(--border-light)',
                      }}
                    >
                      <img
                        src={getImageUrl(foodItem.image)}
                        alt={foodItem.name}
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: 'var(--radius-sm)',
                          objectFit: 'cover',
                          backgroundColor: 'var(--bg-subtle)',
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                          {foodItem.name}
                        </h4>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                          {formatLKR(foodItem.price)} each
                        </div>

                        {/* Quantity Counter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                          <button
                            onClick={() => updateQuantity(foodItem._id, -1)}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--bg-subtle)',
                              border: '1px solid var(--border-light)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconMinus size={13} />
                          </button>
                          <span style={{ fontWeight: 800, fontSize: '0.92rem', minWidth: '18px', textAlign: 'center' }}>
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(foodItem._id, 1)}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--bg-subtle)',
                              border: '1px solid var(--border-light)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconPlus size={13} />
                          </button>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success)' }}>
                          {formatLKR(itemTotal)}
                        </div>
                        <button
                          onClick={() => removeFromCart(foodItem._id)}
                          style={{
                            color: 'var(--text-subtle)',
                            marginTop: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-subtle)')}
                        >
                          <IconTrash size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address Form Card */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconMapPin size={20} color="var(--primary)" />
                Delivery Address & Notes
              </h3>

              <div className="form-group">
                <label className="form-label">Delivery Street Address *</label>
                <textarea
                  className="form-textarea"
                  placeholder="e.g. Apartment 4B, Blue Ocean Residency, Malabe, Colombo"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Special Instructions for Rider (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ring the bell twice, leave with security gate"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Placement */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div className="card" style={{ padding: '28px', boxShadow: 'var(--shadow-lg)' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Order Summary</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
                <span style={{ fontWeight: 700 }}>{formatLKR(subtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Express Delivery</span>
                <span style={{ fontWeight: 800, color: 'var(--success)' }}>FREE</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery Time</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>25 - 35 mins</span>
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                <label className="form-label">Payment Method</label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--primary)',
                    backgroundColor: 'var(--primary-light)',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>💵</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Cash on Delivery</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Pay with cash directly to the courier upon delivery
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '2px dashed var(--border-light)',
                  marginBottom: '24px',
                }}
              >
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Total</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)' }}>
                  {formatLKR(grandTotal)}
                </span>
              </div>

              {isAuthenticated ? (
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  {loading ? (
                    <div className="spinner" style={{ width: '20px', height: '20px', borderTopColor: '#FFF' }}></div>
                  ) : (
                    <>
                      Confirm & Place Order ({formatLKR(grandTotal)}) <IconArrowRight size={18} />
                    </>
                  )}
                </button>
              ) : (
                <div>
                  <button
                    onClick={() => navigate('/login', { state: { from: { pathname: '/cart' } } })}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginBottom: '10px' }}
                  >
                    Sign In to Place Order
                  </button>
                  <div style={{ fontSize: '0.82rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      Register here
                    </Link>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '16px',
                  fontSize: '0.82rem',
                  color: 'var(--text-subtle)',
                }}
              >
                <IconShield size={14} />
                <span>100% Guaranteed fresh or instant meal replacement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

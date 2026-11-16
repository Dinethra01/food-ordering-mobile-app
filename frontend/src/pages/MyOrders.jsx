import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersApi, cancelOrderApi, getImageUrl } from '../services/api';
import { IconPackage, IconClock, IconMapPin, IconClose, IconArrowRight, IconCheckCircle } from '../components/common/Icons';
import { formatLKR } from '../utils/currency';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getOrdersApi();
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Could not fetch order history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this pending order?')) {
      return;
    }

    try {
      const response = await cancelOrderApi(orderId);
      if (response.data.success) {
        setActionMessage('Order cancelled successfully! Stock was restored.');
        setTimeout(() => setActionMessage(''), 4000);
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Preparing':
        return 'status-preparing';
      case 'Out for Delivery':
        return 'status-out-for-delivery';
      case 'Delivered':
        return 'status-delivered';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const statusSteps = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '6px' }}>My Orders & Tracking</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Track preparation status and view your past meals ordered on web and mobile.
            </p>
          </div>

          <Link to="/menu" className="btn btn-primary btn-sm">
            Order Again <IconArrowRight size={15} />
          </Link>
        </div>

        {actionMessage && <div className="alert alert-success">{actionMessage}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: '16px' }}>
            <div className="spinner spinner-lg"></div>
            <p style={{ color: 'var(--text-muted)' }}>Fetching your order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '64px', marginBottom: '14px' }}>📦</span>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Orders Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '340px' }}>
              You haven't placed any orders with FoodieExpress yet. Treat yourself to something delicious!
            </p>
            <Link to="/menu" className="btn btn-primary">
              Explore Our Menu
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map((order) => {
              const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isCancelled = order.orderStatus === 'Cancelled';
              const currentStepIdx = statusSteps.indexOf(order.orderStatus);

              return (
                <div key={order._id} className="card" style={{ padding: '24px', boxShadow: 'var(--shadow-md)' }}>
                  {/* Order Top Bar */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid var(--border-light)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>
                          Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </span>
                        <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Placed on {dateFormatted}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)' }}>
                        {formatLKR(order.totalAmount)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {order.paymentMethod || 'Cash on Delivery'}
                      </div>
                    </div>
                  </div>

                  {/* Progress Tracker (only if not cancelled) */}
                  {!isCancelled && (
                    <div
                      style={{
                        padding: '24px 12px 16px',
                        borderBottom: '1px solid var(--border-light)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          position: 'relative',
                        }}
                      >
                        {statusSteps.map((step, idx) => {
                          const isCompleted = currentStepIdx >= idx;
                          const isCurrent = currentStepIdx === idx;

                          return (
                            <div
                              key={step}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 2,
                                flex: 1,
                              }}
                            >
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  backgroundColor: isCompleted ? 'var(--primary)' : 'var(--bg-subtle)',
                                  color: isCompleted ? '#FFFFFF' : 'var(--text-subtle)',
                                  border: `2px solid ${isCompleted ? 'var(--primary)' : 'var(--border-light)'}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  boxShadow: isCurrent ? '0 0 0 4px var(--primary-light)' : 'none',
                                  transition: 'all 0.3s ease',
                                }}
                              >
                                {isCompleted ? '✓' : idx + 1}
                              </div>
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: isCurrent ? 700 : 500,
                                  color: isCurrent ? 'var(--primary)' : isCompleted ? 'var(--text-main)' : 'var(--text-subtle)',
                                  marginTop: '6px',
                                  textAlign: 'center',
                                }}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Order Items List */}
                  <div style={{ padding: '18px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {order.items.map((subItem, index) => {
                        const itemObj = subItem.foodItemId || {};
                        const name = itemObj.name || 'Food Item';
                        const image = itemObj.image;
                        const subTotal = (Number(subItem.price) || 0) * subItem.quantity;

                        return (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={getImageUrl(image)}
                                alt={name}
                                style={{
                                  width: '46px',
                                  height: '46px',
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  backgroundColor: 'var(--bg-subtle)',
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200';
                                }}
                              />
                              <div>
                                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                  {subItem.quantity}x {name}
                                </span>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  {formatLKR(subItem.price)} each
                                </div>
                              </div>
                            </div>

                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                              {formatLKR(subTotal)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Address & Actions Bottom Row */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      paddingTop: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      <IconMapPin size={16} color="var(--primary)" />
                      <span>Delivery to: <strong>{order.deliveryAddress}</strong></span>
                    </div>

                    {order.orderStatus === 'Pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

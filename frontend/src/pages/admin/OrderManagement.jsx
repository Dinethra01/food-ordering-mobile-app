import React, { useState, useEffect } from 'react';
import { getOrdersApi, updateOrderStatusApi, getImageUrl } from '../../services/api';
import { IconSearch, IconClose, IconPackage, IconMapPin, IconClock } from '../../components/common/Icons';
import { formatLKR } from '../../utils/currency';

export const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const statuses = ['All', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getOrdersApi();
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      setError('Could not fetch orders from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatusApi(orderId, newStatus);
      if (response.data.success) {
        setActionSuccess(`Order #${orderId.substring(orderId.length - 6)} status updated to '${newStatus}'!`);
        setTimeout(() => setActionSuccess(''), 3000);
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusBadgeClass = (status) => {
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

  const filteredOrders = orders.filter((order) => {
    const matchStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      order._id.toLowerCase().includes(q) ||
      order.userId?.name?.toLowerCase().includes(q) ||
      order.userId?.email?.toLowerCase().includes(q) ||
      order.deliveryAddress?.toLowerCase().includes(q);

    return matchStatus && matchSearch;
  });

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '6px' }}>Customer Orders Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Monitor and fulfill all food orders placed via the Web portal or React Native Mobile application.
          </p>
        </div>

        {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Filter Bar */}
        <div
          className="card"
          style={{
            padding: '20px',
            marginBottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  backgroundColor: statusFilter === st ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: statusFilter === st ? '#FFF' : 'var(--text-main)',
                  border: `1px solid ${statusFilter === st ? 'var(--primary)' : 'var(--border-light)'}`,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0 12px',
              border: '1px solid var(--border-light)',
            }}
          >
            <IconSearch size={18} color="var(--text-subtle)" />
            <input
              type="text"
              placeholder="Search by Order ID, customer name, email or delivery address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: '10px 12px',
                width: '100%',
                fontSize: '0.9rem',
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ color: 'var(--text-subtle)' }}>
                <IconClose size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <div className="spinner spinner-lg"></div>
            <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Loading platform orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>📦</span>
            <h3>No orders found matching your filter</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredOrders.map((order) => {
              const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isFinished = order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled';

              return (
                <div key={order._id} className="card" style={{ padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                  {/* Order Card Header */}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>
                          Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </span>
                        <span className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Customer: <strong>{order.userId?.name || 'Customer'}</strong> ({order.userId?.email || 'N/A'}) • {dateFormatted}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
                        {formatLKR(order.totalAmount)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {order.paymentMethod || 'Cash on Delivery'}
                      </div>
                    </div>
                  </div>

                  {/* Items Grid */}
                  <div
                    style={{
                      padding: '16px 0',
                      borderBottom: '1px solid var(--border-light)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          backgroundColor: 'var(--bg-subtle)',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        <img
                          src={getImageUrl(item.foodItemId?.image)}
                          alt={item.foodItemId?.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '6px',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200';
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.quantity}x {item.foodItemId?.name || 'Dish'}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {formatLKR(item.price)} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location & Action Row */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '14px',
                      paddingTop: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      <IconMapPin size={16} color="var(--primary)" />
                      <span>Delivery Address: <strong>{order.deliveryAddress}</strong></span>
                    </div>

                    {/* Status Changer Actions */}
                    {!isFinished && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {order.orderStatus === 'Pending' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'Preparing')}
                            className="btn btn-primary btn-sm"
                          >
                            Mark as Preparing ➔
                          </button>
                        )}
                        {order.orderStatus === 'Preparing' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'Out for Delivery')}
                            className="btn btn-primary btn-sm"
                            style={{ backgroundColor: 'var(--purple)' }}
                          >
                            Mark Out for Delivery ➔
                          </button>
                        )}
                        {order.orderStatus === 'Out for Delivery' && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                            className="btn btn-success btn-sm"
                          >
                            Mark as Delivered ✓
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm('Cancel this customer order and return stock to inventory?')) {
                              handleUpdateStatus(order._id, 'Cancelled');
                            }
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                        >
                          Cancel Order
                        </button>
                      </div>
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

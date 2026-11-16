import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFoodItemsApi, getOrdersApi, updateOrderStatusApi, getImageUrl } from '../../services/api';
import {
  IconPackage,
  IconDollar,
  IconClock,
  IconShield,
  IconArrowRight,
  IconCheckCircle,
} from '../../components/common/Icons';
import { formatLKR } from '../../utils/currency';

export const AdminDashboard = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

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
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute live statistics from MongoDB records
  const totalItems = foodItems.length;
  const inStockItems = foodItems.filter((i) => i.isAvailable && i.stockQuantity > 0).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
  const activeOrders = orders.filter((o) => ['Pending', 'Preparing', 'Out for Delivery'].includes(o.orderStatus)).length;
  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const handleAdvanceStatus = async (orderId, currentStatus) => {
    const nextStatusMap = {
      Pending: 'Preparing',
      Preparing: 'Out for Delivery',
      'Out for Delivery': 'Delivered',
    };

    const nextStatus = nextStatusMap[currentStatus];
    if (!nextStatus) return;

    try {
      const response = await updateOrderStatusApi(orderId, nextStatus);
      if (response.data.success) {
        setActionSuccess(`Order #${orderId.substring(orderId.length - 6)} advanced to '${nextStatus}'!`);
        setTimeout(() => setActionSuccess(''), 3000);
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusBadge = (status) => {
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

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge" style={{ backgroundColor: '#EEF2FF', color: '#6366F1', border: '1px solid #C7D2FE' }}>
                <IconShield size={14} color="#6366F1" /> Administrator Control Panel
              </span>
            </div>
            <h1 style={{ fontSize: '2.4rem' }}>Admin Operations Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Real-time synchronization across Mobile App and Web Storefront.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/admin/food" className="btn btn-secondary btn-sm">
              Manage Food Menu ➔
            </Link>
            <Link to="/admin/orders" className="btn btn-primary btn-sm">
              Manage All Orders ➔
            </Link>
          </div>
        </div>

        {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}

        {/* 4 Statistics Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {/* Card 1: Revenue */}
          <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--success)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>GROSS SALES</div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
                  {loading ? '...' : formatLKR(totalRevenue)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px' }}>
                  Verified from completed orders
                </div>
              </div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconDollar size={22} />
              </div>
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL ORDERS</div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
                  {loading ? '...' : totalOrders}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '4px' }}>
                  {activeOrders} currently in fulfillment
                </div>
              </div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconPackage size={22} />
              </div>
            </div>
          </div>

          {/* Card 3: Pending Action */}
          <div className="card" style={{ padding: '24px', borderLeft: '4px solid #F59E0B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>PENDING ORDERS</div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#B45309', marginTop: '6px' }}>
                  {loading ? '...' : pendingOrders}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Requires kitchen confirmation
                </div>
              </div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#FEF3C7',
                  color: '#B45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconClock size={22} />
              </div>
            </div>
          </div>

          {/* Card 4: Food Catalog */}
          <div className="card" style={{ padding: '24px', borderLeft: '4px solid #6366F1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE FOOD ITEMS</div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#4338CA', marginTop: '6px' }}>
                  {loading ? '...' : totalItems}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px' }}>
                  {inStockItems} ready in stock
                </div>
              </div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#EEF2FF',
                  color: '#6366F1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                }}
              >
                🍔
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section with Quick Status Progression */}
        <div className="card" style={{ padding: '28px', marginBottom: '40px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '4px' }}>Recent Customer Orders</h3>
              <p style={{ fontSize: '0.88rem' }}>
                Manage workflow stages: Pending → Preparing → Out for Delivery → Delivered
              </p>
            </div>
            <Link to="/admin/orders" className="btn btn-outline btn-sm">
              View Full Orders Table ({orders.length}) <IconArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <div className="spinner"></div>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              No orders have been recorded in the database yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Order ID</th>
                    <th style={{ padding: '12px' }}>Customer</th>
                    <th style={{ padding: '12px' }}>Items Summary</th>
                    <th style={{ padding: '12px' }}>Total (LKR)</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Workflow Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => {
                    const canAdvance = ['Pending', 'Preparing', 'Out for Delivery'].includes(order.orderStatus);
                    const nextStatusMap = {
                      Pending: 'Preparing',
                      Preparing: 'Out for Delivery',
                      'Out for Delivery': 'Delivered',
                    };

                    return (
                      <tr key={order._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '14px 12px', fontWeight: 700 }}>
                          #{order._id.substring(order._id.length - 6).toUpperCase()}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ fontWeight: 600 }}>{order.userId?.name || 'Customer'}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.userId?.email}</div>
                        </td>
                        <td style={{ padding: '14px 12px', maxWidth: '240px' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {order.items?.map((it) => `${it.quantity}x ${it.foodItemId?.name || 'Item'}`).join(', ')}
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--success)' }}>
                          {formatLKR(order.totalAmount)}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span className={`status-badge ${getStatusBadge(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                          {canAdvance ? (
                            <button
                              onClick={() => handleAdvanceStatus(order._id, order.orderStatus)}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              Advance to {nextStatusMap[order.orderStatus]} ➔
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                              {order.orderStatus === 'Delivered' ? '✅ Completed' : '❌ Cancelled'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

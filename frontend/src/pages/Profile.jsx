import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrdersApi } from '../services/api';
import { IconUser, IconMail, IconPackage, IconShield, IconLogout, IconArrowRight } from '../components/common/Icons';
import { formatLKR } from '../utils/currency';

export const Profile = () => {
  const { user, isAdmin, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Customer Profile</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Manage your account details and view your food ordering statistics.
        </p>

        {/* Profile Card */}
        <div className="card" style={{ padding: '36px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Big Avatar */}
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.4rem',
                fontWeight: 800,
                boxShadow: 'var(--shadow-primary)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* User Info */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '1.6rem' }}>{user?.name}</h2>
                <span
                  className="badge"
                  style={{
                    backgroundColor: isAdmin ? '#EEF2FF' : '#ECFDF5',
                    color: isAdmin ? '#6366F1' : '#059669',
                    border: `1px solid ${isAdmin ? '#C7D2FE' : '#A7F3D0'}`,
                  }}
                >
                  {isAdmin ? 'Admin Staff 👑' : 'Customer 🍔'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '4px' }}>
                <IconMail size={16} />
                <span>{user?.email}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                Foodie Member since {memberSince}
              </div>
            </div>

            <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
              <IconLogout size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* User Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📦</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {loading ? '...' : orders.length}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Total Orders Placed</div>
          </div>

          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>💵</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>
              {loading ? '...' : formatLKR(totalSpent)}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Lifetime Food Spent</div>
          </div>

          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>⚡</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
              {loading ? '...' : orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Preparing').length}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Active Orders in Kitchen</div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <Link
            to="/orders"
            className="card"
            style={{
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                }}
              >
                <IconPackage size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '2px' }}>View Order History</h4>
                <p style={{ fontSize: '0.85rem' }}>Track orders & delivery receipts</p>
              </div>
            </div>
            <IconArrowRight size={18} color="var(--primary)" />
          </Link>

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="card"
              style={{
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1.5px solid #C7D2FE',
                backgroundColor: '#FAFAFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: '#EEF2FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6366F1',
                  }}
                >
                  <IconShield size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '2px', color: '#4338CA' }}>Admin Dashboard</h4>
                  <p style={{ fontSize: '0.85rem', color: '#6366F1' }}>Manage food, inventory & orders</p>
                </div>
              </div>
              <IconArrowRight size={18} color="#6366F1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

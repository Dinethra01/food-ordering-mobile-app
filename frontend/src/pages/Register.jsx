import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconArrowRight } from '../components/common/Icons';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await register(name.trim(), email.trim(), password, role);
    setLoading(false);

    if (result.success) {
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/menu');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: 'var(--hero-gradient)',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 14px',
              boxShadow: 'var(--shadow-primary)',
            }}
          >
            🍔
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Join FoodieExpress and enjoy rapid food delivery
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password (Min 6 characters)</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          {/* Account Role Selector */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Select Account Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setRole('user')}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${role === 'user' ? 'var(--primary)' : 'var(--border-light)'}`,
                  backgroundColor: role === 'user' ? 'var(--primary-light)' : 'var(--bg-surface)',
                  color: role === 'user' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                🍔 Customer User
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${role === 'admin' ? '#6366F1' : 'var(--border-light)'}`,
                  backgroundColor: role === 'admin' ? '#EEF2FF' : 'var(--bg-surface)',
                  color: role === 'admin' ? '#6366F1' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                👑 Admin Staff
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '20px', height: '20px', borderTopColor: '#FFF' }}></div>
            ) : (
              <>
                Create Account <IconArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

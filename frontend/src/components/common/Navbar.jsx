import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  IconBurger,
  IconCart,
  IconUser,
  IconMenu,
  IconClose,
  IconLogout,
  IconPackage,
  IconShield,
} from './Icons';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartCount, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on navigation
  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : '#FFFFFF',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: isScrolled ? 'var(--shadow-md)' : 'none',
        transition: 'all var(--transition-normal)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={handleNavClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '1.45rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-main)',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-primary)',
            }}
          >
            <span style={{ fontSize: '22px' }}>🍔</span>
          </div>
          <span>
            Foodie<span style={{ color: 'var(--primary)' }}>Express</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
          }}
          className="desktop-nav"
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.98rem',
              color: isActive ? 'var(--primary)' : 'var(--text-main)',
              position: 'relative',
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.98rem',
              color: isActive ? 'var(--primary)' : 'var(--text-main)',
            })}
          >
            Menu
          </NavLink>
          <NavLink
            to="/about"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.98rem',
              color: isActive ? 'var(--primary)' : 'var(--text-main)',
            })}
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.98rem',
              color: isActive ? 'var(--primary)' : 'var(--text-main)',
            })}
          >
            Contact
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin/dashboard"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 700,
                fontSize: '0.92rem',
                color: '#6366F1',
                backgroundColor: '#EEF2FF',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #C7D2FE',
              })}
            >
              <IconShield size={14} color="#6366F1" /> Admin Portal
            </NavLink>
          )}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Cart Icon Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="View Cart"
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-light)';
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
              e.currentTarget.style.borderColor = 'var(--border-light)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
          >
            <IconCart size={20} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'var(--text-main)',
                    maxWidth: '110px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.name}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '230px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-xl)',
                    padding: '8px',
                    zIndex: 1000,
                    animation: 'slideUp 0.18s ease',
                  }}
                >
                  {/* User Profile header */}
                  <div
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--border-light)',
                      marginBottom: '6px',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                    <div style={{ marginTop: '6px' }}>
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
                  </div>

                  <Link
                    to="/orders"
                    onClick={handleNavClick}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      color: 'var(--text-main)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <IconPackage size={17} color="var(--primary)" />
                    My Orders
                  </Link>

                  <Link
                    to="/profile"
                    onClick={handleNavClick}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      color: 'var(--text-main)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <IconUser size={17} color="var(--text-muted)" />
                    My Profile
                  </Link>

                  {isAdmin && (
                    <>
                      <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '6px 0' }} />
                      <Link
                        to="/admin/dashboard"
                        onClick={handleNavClick}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.9rem',
                          color: '#6366F1',
                          fontWeight: 600,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EEF2FF')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <IconShield size={17} color="#6366F1" />
                        Admin Dashboard
                      </Link>
                    </>
                  )}

                  <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '6px 0' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      color: 'var(--danger)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <IconLogout size={17} color="var(--danger)" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            style={{
              display: 'none',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <IconClose size={24} /> : <IconMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--border-light)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <NavLink to="/" onClick={handleNavClick} style={{ fontWeight: 600, fontSize: '1.05rem', padding: '6px 0' }}>
            Home
          </NavLink>
          <NavLink to="/menu" onClick={handleNavClick} style={{ fontWeight: 600, fontSize: '1.05rem', padding: '6px 0' }}>
            Browse Menu
          </NavLink>
          <NavLink to="/about" onClick={handleNavClick} style={{ fontWeight: 600, fontSize: '1.05rem', padding: '6px 0' }}>
            About Us
          </NavLink>
          <NavLink to="/contact" onClick={handleNavClick} style={{ fontWeight: 600, fontSize: '1.05rem', padding: '6px 0' }}>
            Contact Us
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin/dashboard"
              onClick={handleNavClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                color: '#6366F1',
                padding: '8px 0',
              }}
            >
              <IconShield size={18} /> Admin Dashboard
            </NavLink>
          )}

          <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '8px 0' }} />

          {isAuthenticated ? (
            <>
              <Link to="/orders" onClick={handleNavClick} style={{ padding: '6px 0', color: 'var(--primary)', fontWeight: 600 }}>
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                style={{ textAlign: 'left', color: 'var(--danger)', fontWeight: 600, padding: '6px 0' }}
              >
                Log Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <Link to="/login" onClick={handleNavClick} className="btn btn-secondary" style={{ flex: 1 }}>
                Sign In
              </Link>
              <Link to="/register" onClick={handleNavClick} className="btn btn-primary" style={{ flex: 1 }}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Media query styling for responsive toggle */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};

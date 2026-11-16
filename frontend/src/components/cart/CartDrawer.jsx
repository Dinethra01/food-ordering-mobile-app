import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../services/api';
import { IconClose, IconPlus, IconMinus, IconTrash, IconArrowRight } from '../common/Icons';

export const CartDrawer = () => {
  const {
    cartItems,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const total = getCartTotal();

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={() => setIsDrawerOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          animation: 'slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🛒</span>
            <h3 style={{ fontSize: '1.25rem' }}>Your Cart</h3>
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
              }}
            >
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="modal-close-btn"
            aria-label="Close cart"
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* Drawer Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {cartItems.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                padding: '20px',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  marginBottom: '16px',
                }}
              >
                🛍️
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '24px', maxWidth: '240px' }}>
                Looks like you haven't added any appetizing meals yet!
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/menu');
                }}
              >
                Browse Delicious Menu
              </button>
            </div>
          ) : (
            cartItems.map(({ foodItem, quantity }) => {
              const itemTotal = Number(foodItem.price) * quantity;
              return (
                <div
                  key={foodItem._id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-surface)',
                    boxShadow: 'var(--shadow-sm)',
                    alignItems: 'center',
                  }}
                >
                  {/* Food Image */}
                  <img
                    src={getImageUrl(foodItem.image)}
                    alt={foodItem.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover',
                      backgroundColor: 'var(--bg-subtle)',
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                    }}
                  />

                  {/* Food Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '4px',
                      }}
                    >
                      {foodItem.name}
                    </h5>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                      ${Number(foodItem.price).toFixed(2)}
                    </div>

                    {/* Quantity Selector */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '8px',
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(foodItem._id, -1)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-subtle)',
                          border: '1px solid var(--border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconMinus size={12} />
                      </button>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(foodItem._id, 1)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-subtle)',
                          border: '1px solid var(--border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconPlus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button & Total */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <button
                      onClick={() => removeFromCart(foodItem._id)}
                      style={{
                        color: 'var(--text-subtle)',
                        padding: '4px',
                        transition: 'color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-subtle)')}
                    >
                      <IconTrash size={15} />
                    </button>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--success)' }}>
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer with Totals & Action */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Standard Delivery</span>
              <span style={{ fontWeight: 700, color: 'var(--success)' }}>FREE</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-light)',
                marginBottom: '18px',
              }}
            >
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>
                ${total.toFixed(2)}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={clearCart}
                style={{ flex: '0 0 auto' }}
              >
                Clear
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCheckout}
                style={{ flex: 1 }}
              >
                Checkout Now <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideLeft {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

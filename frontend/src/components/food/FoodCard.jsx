import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../services/api';
import { IconPlus, IconCheckCircle, IconEdit, IconTrash } from '../common/Icons';
import { formatLKR } from '../../utils/currency';

export const FoodCard = ({ foodItem, onSelect, onEdit, onDelete }) => {
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = !foodItem.isAvailable || foodItem.stockQuantity <= 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    const result = addToCart(foodItem, 1);
    if (result.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    } else {
      alert(result.message);
    }
  };

  return (
    <div
      className="card"
      onClick={() => onSelect && onSelect(foodItem)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all var(--transition-normal)',
      }}
    >
      {/* Food Image Container */}
      <div
        style={{
          position: 'relative',
          height: '200px',
          backgroundColor: 'var(--bg-subtle)',
          overflow: 'hidden',
        }}
      >
        <img
          src={getImageUrl(foodItem.image)}
          alt={foodItem.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        />

        {/* Category Pill */}
        <span
          className="badge badge-category"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {foodItem.category}
        </span>

        {/* Stock Badge */}
        <span
          className={`badge ${isOutOfStock ? 'badge-out-of-stock' : 'badge-in-stock'}`}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backdropFilter: 'blur(6px)',
            backgroundColor: isOutOfStock ? 'rgba(254, 242, 242, 0.95)' : 'rgba(236, 253, 245, 0.95)',
          }}
        >
          {isOutOfStock ? 'Sold Out' : `In Stock: ${foodItem.stockQuantity}`}
        </span>

        {/* Admin Quick Action Controls */}
        {isAdmin && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              display: 'flex',
              gap: '6px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit && (
              <button
                className="btn btn-sm"
                onClick={() => onEdit(foodItem)}
                style={{
                  backgroundColor: 'rgba(37, 99, 235, 0.9)',
                  color: '#FFF',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                title="Edit Food Item"
              >
                <IconEdit size={14} />
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-sm"
                onClick={() => onDelete(foodItem)}
                style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.9)',
                  color: '#FFF',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                title="Delete Food Item"
              >
                <IconTrash size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div
        style={{
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
          <h4
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              lineHeight: 1.3,
              color: 'var(--text-main)',
            }}
          >
            {foodItem.name}
          </h4>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--success)',
              whiteSpace: 'nowrap',
            }}
          >
            {formatLKR(foodItem.price)}
          </span>
        </div>

        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {foodItem.description}
        </p>

        {/* Footer with Add Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            Freshly prepared
          </span>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`btn btn-sm ${justAdded ? 'btn-success' : 'btn-primary'}`}
            style={{
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
            }}
          >
            {justAdded ? (
              <>
                <IconCheckCircle size={15} /> Added!
              </>
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <>
                <IconPlus size={15} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

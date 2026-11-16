import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../services/api';
import { IconClose, IconPlus, IconMinus, IconCheckCircle, IconTruck, IconClock } from '../common/Icons';
import { formatLKR } from '../../utils/currency';

export const FoodDetailModal = ({ foodItem, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!foodItem) return null;

  const isOutOfStock = !foodItem.isAvailable || foodItem.stockQuantity <= 0;
  const maxStock = foodItem.stockQuantity || 1;
  const itemTotal = Number(foodItem.price) * quantity;

  const handleIncrement = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const result = addToCart(foodItem, quantity);
    if (result.success) {
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        onClose();
      }, 1000);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Image Banner */}
        <div style={{ position: 'relative', height: '280px', backgroundColor: 'var(--bg-subtle)' }}>
          <img
            src={getImageUrl(foodItem.image)}
            alt={foodItem.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
            }}
          />

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              color: 'var(--text-main)',
            }}
          >
            <IconClose size={20} />
          </button>

          <span
            className="badge badge-category"
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {foodItem.category}
          </span>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{foodItem.name}</h2>
              <span className={`badge ${isOutOfStock ? 'badge-out-of-stock' : 'badge-in-stock'}`}>
                {isOutOfStock ? 'Currently Out of Stock' : `Available in Kitchen (${foodItem.stockQuantity} ready)`}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>
                {formatLKR(foodItem.price)}
              </span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>per portion</div>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '24px' }}>
            {foodItem.description}
          </p>

          {/* Quick Perks */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              padding: '16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <IconTruck size={18} color="var(--primary)" />
              <span>Free 30-min express delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <IconClock size={18} color="var(--primary)" />
              <span>Prepared fresh upon order</span>
            </div>
          </div>

          {/* Controls Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            {/* Quantity Selector */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
              }}
            >
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1 || isOutOfStock}
                style={{ opacity: quantity <= 1 ? 0.4 : 1, padding: '4px' }}
              >
                <IconMinus size={16} />
              </button>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', minWidth: '24px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={quantity >= maxStock || isOutOfStock}
                style={{ opacity: quantity >= maxStock ? 0.4 : 1, padding: '4px' }}
              >
                <IconPlus size={16} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`btn btn-lg ${added ? 'btn-success' : 'btn-primary'}`}
              style={{ flex: 1 }}
            >
              {added ? (
                <>
                  <IconCheckCircle size={20} /> Added to Order!
                </>
              ) : isOutOfStock ? (
                'Sold Out'
              ) : (
                <>
                  <IconPlus size={20} /> Add to Cart — {formatLKR(itemTotal)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

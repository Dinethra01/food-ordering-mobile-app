import React from 'react';

const CATEGORIES = [
  { label: 'All', icon: '🍽️' },
  { label: 'Main Course', icon: '🍔' },
  { label: 'Starters', icon: '🍟' },
  { label: 'Desserts', icon: '🍰' },
  { label: 'Beverages', icon: '🥤' },
];

export const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '8px',
        scrollbarWidth: 'none',
      }}
    >
      {CATEGORIES.map(({ label, icon }) => {
        const isActive = selectedCategory === label;
        return (
          <button
            key={label}
            onClick={() => onSelectCategory(label)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.92rem',
              backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-surface)',
              color: isActive ? '#FFFFFF' : 'var(--text-main)',
              border: `1.5px solid ${isActive ? 'var(--primary)' : 'var(--border-light)'}`,
              boxShadow: isActive ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.color = 'var(--text-main)';
              }
            }}
          >
            <span style={{ fontSize: '18px' }}>{icon}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

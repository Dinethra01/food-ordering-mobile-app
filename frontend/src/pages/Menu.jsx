import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFoodItemsApi } from '../services/api';
import { FoodCard } from '../components/food/FoodCard';
import { CategoryFilter } from '../components/food/CategoryFilter';
import { FoodDetailModal } from '../components/food/FoodDetailModal';
import { IconSearch, IconClose } from '../components/common/Icons';

export const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);

  // Read URL query params
  const categoryParam = searchParams.get('category') || 'All';
  const queryParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [sortBy, setSortBy] = useState('default');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (queryParam) setSearchQuery(queryParam);
  }, [categoryParam, queryParam]);

  // Fetch food items from backend
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getFoodItemsApi();
      if (response.data.success) {
        setFoodItems(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load menu items:', err);
      setError('Could not connect to the menu service. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (!val.trim()) {
      newParams.delete('search');
    } else {
      newParams.set('search', val.trim());
    }
    setSearchParams(newParams);
  };

  // Filter and sort items locally for instant feedback
  const filteredItems = useMemo(() => {
    return foodItems
      .filter((item) => {
        // Category filter
        const matchCategory =
          selectedCategory === 'All' ||
          item.category?.toLowerCase() === selectedCategory.toLowerCase();

        // Search query filter
        const matchSearch =
          !searchQuery.trim() ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase());

        // In Stock filter
        const matchStock = !inStockOnly || (item.isAvailable && item.stockQuantity > 0);

        return matchCategory && matchSearch && matchStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // Default order
      });
  }, [foodItems, selectedCategory, searchQuery, inStockOnly, sortBy]);

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Menu Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Our Delicious Menu</h1>
          <p style={{ fontSize: '1.05rem' }}>
            Handcrafted with love. Pick your favorite dishes and enjoy speedy delivery straight to your table.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div
          className="card"
          style={{
            padding: '20px',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* Top row: Category Pills */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />

          {/* Bottom row: Search input, Sort, Stock Toggle */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0 14px',
                border: '1px solid var(--border-light)',
                flex: '1 1 280px',
              }}
            >
              <IconSearch size={18} color="var(--text-subtle)" />
              <input
                type="text"
                placeholder="Search food by name or ingredient..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '10px 12px',
                  width: '100%',
                  fontSize: '0.92rem',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  style={{ color: 'var(--text-subtle)', cursor: 'pointer' }}
                >
                  <IconClose size={16} />
                </button>
              )}
            </div>

            {/* Sort & In-Stock Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Sort by:</span>
                <select
                  className="form-select"
                  style={{ padding: '8px 14px', width: 'auto', fontSize: '0.88rem' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Featured / Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                In Stock Only
              </label>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '24px' }}>
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Food Items Catalog */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: '16px' }}>
            <div className="spinner spinner-lg"></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading fresh dishes from kitchen...</p>
          </div>
        ) : filteredItems.length === 0 ? (
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
            <span style={{ fontSize: '54px', marginBottom: '14px' }}>🍽️</span>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Food Items Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', maxWidth: '380px' }}>
              We couldn't find any dishes matching your current search or category filter. Try clearing filters!
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setInStockOnly(false);
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredItems.map((item) => (
              <FoodCard
                key={item._id}
                foodItem={item}
                onSelect={(selected) => setSelectedFood(selected)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedFood && (
        <FoodDetailModal
          foodItem={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
};

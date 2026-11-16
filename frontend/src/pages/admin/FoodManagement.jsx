import React, { useState, useEffect } from 'react';
import { getFoodItemsApi, deleteFoodItemApi, getImageUrl } from '../../services/api';
import { AdminFoodModal } from '../../components/admin/AdminFoodModal';
import { IconPlus, IconEdit, IconTrash, IconSearch, IconClose } from '../../components/common/Icons';
import { formatLKR } from '../../utils/currency';

export const FoodManagement = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal control state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const categories = ['All', 'Main Course', 'Starters', 'Desserts', 'Beverages'];

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getFoodItemsApi();
      if (response.data.success) {
        setFoodItems(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching food items:', err);
      setError('Could not load food catalog from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete '${item.name}' from the menu?`)) {
      return;
    }

    try {
      const response = await deleteFoodItemApi(item._id);
      if (response.data.success) {
        setSuccessMessage(`'${item.name}' was removed from the catalog.`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchFoodItems();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete food item.');
    }
  };

  const filteredItems = foodItems.filter((item) => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            gap: '16px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '6px' }}>Food Menu Management</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Add, update, or remove dishes. Changes sync instantly to the mobile application.
            </p>
          </div>

          <button onClick={handleOpenCreate} className="btn btn-primary">
            <IconPlus size={18} /> Add New Food Item
          </button>
        </div>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Filter Controls Card */}
        <div
          className="card"
          style={{
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0 12px',
              border: '1px solid var(--border-light)',
              flex: '1 1 260px',
            }}
          >
            <IconSearch size={18} color="var(--text-subtle)" />
            <input
              type="text"
              placeholder="Search items by name..."
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

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: selectedCategory === cat ? '#FFF' : 'var(--text-main)',
                  border: `1px solid ${selectedCategory === cat ? 'var(--primary)' : 'var(--border-light)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <div className="spinner spinner-lg"></div>
              <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Loading food items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              No food items match your query. Click "+ Add New Food Item" above to add one.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Dish Preview</th>
                  <th style={{ padding: '12px' }}>Category</th>
                  <th style={{ padding: '12px' }}>Price (LKR)</th>
                  <th style={{ padding: '12px' }}>Stock Inventory</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const isLowStock = item.stockQuantity <= 5 && item.stockQuantity > 0;
                  const isOutOfStock = !item.isAvailable || item.stockQuantity <= 0;

                  return (
                    <tr key={item._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      {/* Thumbnail & Title */}
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            style={{
                              width: '54px',
                              height: '54px',
                              borderRadius: 'var(--radius-sm)',
                              objectFit: 'cover',
                              backgroundColor: 'var(--bg-subtle)',
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200';
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{item.name}</div>
                            <div
                              style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                maxWidth: '280px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '14px 12px' }}>
                        <span className="badge badge-category">{item.category}</span>
                      </td>

                      {/* Price */}
                      <td style={{ padding: '14px 12px', fontWeight: 800, color: 'var(--success)' }}>
                        {formatLKR(item.price)}
                      </td>

                      {/* Stock Quantity */}
                      <td style={{ padding: '14px 12px' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: isOutOfStock ? 'var(--danger)' : isLowStock ? '#B45309' : 'var(--text-main)',
                          }}
                        >
                          {item.stockQuantity} units
                        </span>
                        {isLowStock && (
                          <div style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 600 }}>Low stock!</div>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 12px' }}>
                        <span className={`badge ${isOutOfStock ? 'badge-out-of-stock' : 'badge-in-stock'}`}>
                          {isOutOfStock ? 'Out of Stock' : 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '6px 12px', color: '#2563EB' }}
                            title="Edit"
                          >
                            <IconEdit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '6px 12px' }}
                            title="Delete"
                          >
                            <IconTrash size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal for adding or editing items */}
        {modalOpen && (
          <AdminFoodModal
            item={editingItem}
            onClose={() => setModalOpen(false)}
            onSuccess={fetchFoodItems}
          />
        )}
      </div>
    </div>
  );
};

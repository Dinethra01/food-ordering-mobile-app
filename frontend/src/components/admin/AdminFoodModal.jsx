import React, { useState } from 'react';
import { createFoodItemApi, updateFoodItemApi, getImageUrl } from '../../services/api';
import { IconClose } from '../common/Icons';

export const AdminFoodModal = ({ item, onClose, onSuccess }) => {
  const isEditing = !!item;

  const [name, setName] = useState(item?.name || '');
  const [price, setPrice] = useState(item?.price !== undefined ? String(item.price) : '');
  const [category, setCategory] = useState(item?.category || 'Main Course');
  const [stockQuantity, setStockQuantity] = useState(item?.stockQuantity !== undefined ? String(item.stockQuantity) : '20');
  const [description, setDescription] = useState(item?.description || '');
  const [imageUrl, setImageUrl] = useState(item?.image?.startsWith('http') ? item.image : '');
  const [imageFile, setImageFile] = useState(null);
  const [isAvailable, setIsAvailable] = useState(item?.isAvailable !== undefined ? item.isAvailable : true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Main Course', 'Starters', 'Desserts', 'Beverages'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !price || !description.trim() || !stockQuantity) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      setError('Price must be a valid number greater than 0.');
      return;
    }

    if (isNaN(stockQuantity) || Number(stockQuantity) < 0) {
      setError('Stock quantity must be 0 or greater.');
      return;
    }

    setLoading(true);

    try {
      let payload;

      // If user uploaded a physical image file, construct FormData
      if (imageFile) {
        payload = new FormData();
        payload.append('name', name.trim());
        payload.append('price', Number(price));
        payload.append('description', description.trim());
        payload.append('category', category);
        payload.append('stockQuantity', Number(stockQuantity));
        payload.append('isAvailable', isAvailable);
        payload.append('image', imageFile);
      } else {
        // Direct JSON payload
        payload = {
          name: name.trim(),
          price: Number(price),
          description: description.trim(),
          category,
          stockQuantity: Number(stockQuantity),
          isAvailable,
          ...(imageUrl.trim() ? { image: imageUrl.trim() } : {}),
        };
      }

      if (isEditing) {
        await updateFoodItemApi(item._id, payload);
      } else {
        await createFoodItemApi(payload);
      }

      setLoading(false);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Failed to save food item.';
      setError(msg);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? '✏️ Edit Food Item' : '➕ Add New Food Item'}
          </h3>
          <button onClick={onClose} className="modal-close-btn">
            <IconClose size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Dish Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Gourmet Bacon Cheeseburger"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Price (LKR / Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="1650.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="25"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Availability</label>
                <select
                  className="form-select"
                  value={isAvailable ? 'yes' : 'no'}
                  onChange={(e) => setIsAvailable(e.target.value === 'yes')}
                >
                  <option value="yes">Available for Order</option>
                  <option value="no">Hidden / Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Image options */}
            <div className="form-group">
              <label className="form-label">Image URL (Unsplash or Web Link)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImageFile(null);
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Or Upload Image File</label>
              <input
                type="file"
                accept="image/*"
                className="form-input"
                style={{ padding: '8px' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                    setImageUrl('');
                  }
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                placeholder="Describe flavors, ingredients, allergens, and portion..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
              {loading ? 'Saving...' : isEditing ? 'Update Food Item' : 'Create Food Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

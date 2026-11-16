import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('foodie_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync cart changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('foodie_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, [cartItems]);

  const addToCart = (foodItem, qty = 1) => {
    let message = '';
    let success = true;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.foodItem._id === foodItem._id);
      const availableStock = foodItem.stockQuantity !== undefined ? foodItem.stockQuantity : 99;

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        if (currentQty + qty > availableStock) {
          message = `Cannot add more. Only ${availableStock} in stock!`;
          success = false;
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: currentQty + qty,
        };
        message = `Updated ${foodItem.name} quantity in cart!`;
        return updated;
      } else {
        if (qty > availableStock) {
          message = `Cannot add. Only ${availableStock} in stock!`;
          success = false;
          return prevItems;
        }

        message = `Added ${foodItem.name} to cart!`;
        return [...prevItems, { foodItem, quantity: qty }];
      }
    });

    return { success, message };
  };

  const removeFromCart = (foodItemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.foodItem._id !== foodItemId));
  };

  const updateQuantity = (foodItemId, delta) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.foodItem._id === foodItemId) {
            const maxStock = item.foodItem.stockQuantity !== undefined ? item.foodItem.stockQuantity : 99;
            const newQty = item.quantity + delta;

            if (newQty > maxStock) {
              alert(`Maximum available stock reached (${maxStock})`);
              return item;
            }

            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.foodItem.price) || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

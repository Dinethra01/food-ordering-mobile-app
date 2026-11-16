import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (foodItem) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.foodItem._id === foodItem._id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prevItems, { foodItem, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (foodItemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.foodItem._id !== foodItemId));
  };

  const updateQuantity = (foodItemId, delta) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.foodItem._id === foodItemId) {
            const newQty = item.quantity + delta;
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
    return cartItems.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
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

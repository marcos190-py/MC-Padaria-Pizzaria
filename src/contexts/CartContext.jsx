import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ✅ FIX: ID único mais seguro (Date.now + random + counter)
  let cartIdCounter = 0;
  const addToCart = (item) => {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${++cartIdCounter}`;
    setCartItems(prev => [...prev, { ...item, cartId: uniqueId }]);
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  // ✅ FIX: Memoizar cálculo do total para evitar re-renders
  const cartTotal = useMemo(() => 
    cartItems.reduce((acc, item) => acc + item.totalPrice, 0),
    [cartItems]
  );

  // ✅ FIX: Memoizar contagem de itens
  const itemCount = useMemo(() => 
    cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    cartTotal,
    itemCount,
    isCartOpen,
    setIsCartOpen
  }), [cartItems, cartTotal, itemCount, isCartOpen]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
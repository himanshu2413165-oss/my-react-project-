import React, { useState, useCallback, useMemo, createContext, useContext } from "react";

/* ---------------------------------------------------------
   CART CONTEXT
   Shared cart state, used by:
   - Task 1 (ListingPage)  -> addToCart (quick add)
   - Task 2 (ProductPage)  -> addToCart (with quantity)
   - Task 3 (CartPage)     -> cartList, setQty, removeFromCart, clearCart
--------------------------------------------------------- */

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState({}); // { [productId]: { product, qty } }

  const addToCart = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev[product.id];
      const nextQty = (existing?.qty || 0) + qty;
      return { ...prev, [product.id]: { product, qty: nextQty } };
    });
  }, []);

  const setQty = useCallback((productId, qty) => {
    setItems((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: { ...prev[productId], qty } };
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setItems({}), []);

  const cartList = useMemo(() => Object.values(items), [items]);
  const cartCount = useMemo(
    () => cartList.reduce((sum, it) => sum + it.qty, 0),
    [cartList]
  );

  const value = {
    items,
    cartList,
    cartCount,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

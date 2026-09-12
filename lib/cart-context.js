"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch } from "./api";
import { useAuth } from "./auth-context";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const cart = await apiFetch("/cart", { auth: true });
      setCartCount(Array.isArray(cart) ? cart.reduce((sum, i) => sum + (i.quantity || 0), 0) : 0);
    } catch {
      setCartCount(0);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

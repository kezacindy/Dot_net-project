// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // To check if user is authenticated
import {
  getCart,
  addItemToCart as addItemToCartApi,
  updateItemInCart as updateItemInCartApi,
  removeItemFromCart as removeItemFromCartApi,
  clearCart as clearCartApi,
} from '../services/cartService'; // API service for cart operations

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null); // Will hold CartDto: { id, userId, items: [], totalPrice }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth(); // Get user for userId

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setCart(null); // Clear cart if not authenticated or no user id
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const cartData = await getCart(); // Fetches cart for the authenticated user
      setCart(cartData || { items: [], totalPrice: 0 }); // Ensure cart is an object even if null
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart.");
      setCart({ items: [], totalPrice: 0 }); // Set to empty cart on error
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]); // Fetch cart when auth state changes or component mounts

  const addItemToCart = async (productId, quantity) => {
    if (!isAuthenticated) {
      // Handle case where user tries to add to cart without being logged in
      // e.g., redirect to login or show a message
      setError("Please log in to add items to your cart.");
      return;
    }
    setLoading(true);
    try {
      const updatedCart = await addItemToCartApi({ productId, quantity });
      setCart(updatedCart);
      setError(null);
    } catch (err) {
      console.error("Error adding item to cart:", err);
      setError(err.response?.data?.message || "Failed to add item to cart.");
    } finally {
      setLoading(false);
    }
  };

  const updateItemInCart = async (productId, quantity) => {
    setLoading(true);
    try {
      const updatedCart = await updateItemInCartApi(productId, { quantity });
      setCart(updatedCart);
      setError(null);
    } catch (err) {
      console.error("Error updating cart item:", err);
      setError(err.response?.data?.message || "Failed to update cart item.");
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = async (productId) => {
    setLoading(true);
    try {
      await removeItemFromCartApi(productId);
      // Refetch cart to get the updated state or optimistically update
      fetchCart(); // Simplest way to update
      setError(null);
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setError(err.response?.data?.message || "Failed to remove item from cart.");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await clearCartApi();
      setCart({ items: [], totalPrice: 0 }); // Set to empty cart
      setError(null);
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError(err.response?.data?.message || "Failed to clear cart.");
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart?.items?.reduce((count, item) => count + item.quantity, 0) || 0;
  const cartTotal = cart?.totalPrice || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        loading,
        error,
        fetchCart, // Expose fetchCart if manual refresh is needed
        addItemToCart,
        updateItemInCart,
        removeItemFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined || context === null) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
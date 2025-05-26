// src/services/cartService.js
import apiClient from './api';

/**
 * Fetches the current user's cart.
 * GET /api/cart
 */
export const getCart = async () => {
  try {
    const response = await apiClient.get('/cart');
    return response.data; // Expects CartDto
  } catch (error) {
    console.error("Error fetching cart:", error.response?.data || error.message);
    if (error.response && error.response.status === 404) {
        return null; // Or an empty cart structure: { items: [], totalPrice: 0 }
    }
    throw error;
  }
};

/**
 * Adds an item to the cart.
 * POST /api/cart/items
 * @param {object} itemData - { productId: number, quantity: number }
 */
export const addItemToCart = async (itemData) => {
  try {
    const response = await apiClient.post('/cart/items', itemData);
    return response.data; // Expects updated CartDto
  } catch (error) {
    console.error("Error adding item to cart:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Updates an item's quantity in the cart.
 * PUT /api/cart/items/{productId}
 * @param {number|string} productId
 * @param {object} quantityData - { quantity: number }
 */
export const updateItemInCart = async (productId, quantityData) => {
  try {
    const response = await apiClient.put(`/cart/items/${productId}`, quantityData);
    return response.data; // Expects updated CartDto
  } catch (error) {
    console.error(`Error updating item ${productId} in cart:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Removes an item from the cart.
 * DELETE /api/cart/items/{productId}
 * @param {number|string} productId
 */
export const removeItemFromCart = async (productId) => {
  try {
    // Backend might return 204 No Content or the updated cart
    const response = await apiClient.delete(`/cart/items/${productId}`);
    return response.data; // Or handle based on status code
  } catch (error) {
    console.error(`Error removing item ${productId} from cart:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Clears all items from the cart.
 * DELETE /api/cart
 */
export const clearCart = async () => {
  try {
    const response = await apiClient.delete('/cart');
    return response.data; // Or handle based on status code
  } catch (error) {
    console.error("Error clearing cart:", error.response?.data || error.message);
    throw error;
  }
};
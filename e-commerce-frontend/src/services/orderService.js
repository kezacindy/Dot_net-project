// src/services/orderService.js
import apiClient from './api';

export const createOrderFromCart = async (orderDetails) => {
  try {
    console.log("orderService: Attempting to create order with payload:", orderDetails);
    const response = await apiClient.post('/orders', orderDetails); // POST to /api/orders
    console.log("orderService: Order creation API response status:", response.status);
    console.log("orderService: Order creation API response data:", response.data);
    // Ensure backend returns the created order DTO with an ID
    if (response.data && response.data.id) {
        return response.data;
    } else {
        // This case means backend might have returned 2xx but not the expected data
        throw new Error("Order creation response from server was invalid.");
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.response?.data?.Message || error.message || "Failed to create order.";
    console.error("Error creating order (orderService):", errorMsg, "Full Error:", error.response || error);
    // Re-throw a new error or the original error so the component can catch it
    // If re-throwing a new error, make sure to pass enough info or the original error
    throw error; // Or new Error(errorMsg);
  }
};

export const getOrderHistory = async () => {
    try {
        const response = await apiClient.get('/orders/history');
        return response.data || [];
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || "Failed to fetch order history.";
        console.error("Error fetching order history (orderService):", errorMsg, error.response || error);
        throw new Error(errorMsg);
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await apiClient.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        const errorMsg = error.response?.data?.message || error.message || `Failed to fetch order ${orderId}.`;
        console.error(`Error fetching order ${orderId} (orderService):`, errorMsg, error.response || error);
        throw new Error(errorMsg);
    }
};
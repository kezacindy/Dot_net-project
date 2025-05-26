// src/services/adminProductService.js
import apiClient from './api';

export const getAllAdminProducts = async () => {
  try {
    const response = await apiClient.get('/admin/products');
    return response.data;
  } catch (error) {
    console.error("Error fetching admin products:", error.response?.data || error.message);
    throw error;
  }
};

export const getProductByIdAdmin = async (productId) => {
  try {
    // Using admin specific GET for consistency if it exists, otherwise public one
    const response = await apiClient.get(`/admin/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${productId} for admin edit:`, error.response?.data || error.message);
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await apiClient.post('/admin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error.response?.data || error.message);
    throw error;
  }
};

export const updateProduct = async (productId, formData) => {
  try {
    const response = await apiClient.put(`/admin/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/admin/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error.response?.data || error.message);
    throw error;
  }
};
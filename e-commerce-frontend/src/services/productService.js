import apiClient from "./api"; // Import the configured axios instance

// Fetch all products
export const getAllProducts = async () => {
  try {
    const response = await apiClient.get("/products"); // Endpoint defined in ProductsController
    return response.data; // Assuming backend returns the array directly in data
  } catch (error) {
    console.error(
      "Error fetching all products:",
      error.response?.data || error.message
    );
    // Re-throw or return a specific error structure
    throw error;
  }
};

// Fetch a single product by ID
export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching product ${productId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch products by category ID
export const getProductsByCategory = async (categoryId) => {
  try {
    // Matches [HttpGet("category/{categoryId}")] in ProductsController
    const response = await apiClient.get(`/products/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching products for category ${categoryId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Add functions for admin operations later (create, update, delete)
// e.g., createProduct, updateProduct, deleteProduct using POST, PUT, DELETE to /admin/products

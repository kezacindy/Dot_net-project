import apiClient from './api'; // Your configured axios instance

/**
 * Fetches all categories.
 * This endpoint is typically public or accessible to any authenticated user.
 * It corresponds to GET /api/categories in your ProductsController.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of category DTOs.
 */
export const getAllCategories = async () => {
  try {
    const response = await apiClient.get('/categories'); // Matches [HttpGet("~/api/categories")] in ProductsController
    return response.data; // Expects CategoryDto[] from backend: [{ id, name }, ...]
  } catch (error) {
    console.error("Error fetching all categories:", error.response?.data || error.message);
    // You might want to throw a more specific error or return an empty array/null
    // depending on how you want to handle this in components.
    throw error;
  }
};

/**
 * Fetches a single category by its ID.
 * This endpoint is typically public or accessible to any authenticated user.
 * It corresponds to GET /api/categories/{id} in your ProductsController.
 * @param {number|string} categoryId The ID of the category to fetch.
 * @returns {Promise<Object|null>} A promise that resolves to a category DTO or null if not found.
 */
export const getCategoryById = async (categoryId) => {
  try {
    const response = await apiClient.get(`/categories/${categoryId}`); // Matches [HttpGet("~/api/categories/{id}")]
    return response.data; // Expects CategoryDto { id, name }
  } catch (error) {
    console.error(`Error fetching category ${categoryId}:`, error.response?.data || error.message);
    // Handle 404 specifically if needed, or let the component do it based on error.response.status
    if (error.response && error.response.status === 404) {
      return null; // Or throw a custom "NotFound" error
    }
    throw error;
  }
};

// Note: Admin-specific category operations (create, update, delete)
// should remain in src/services/adminCategoryService.js as they
// will likely hit different, protected backend endpoints (e.g., /api/admin/categories).
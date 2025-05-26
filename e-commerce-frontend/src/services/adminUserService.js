// src/services/adminUserService.js
import apiClient from './api'; // Your configured axios instance

/**
 * Fetches all users for the admin view.
 * Requires Admin authentication.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of User DTOs.
 */
export const getAllAdminUsers = async () => {
  try {
    // Assuming your AdminController has a GET endpoint like "users"
    // e.g., [HttpGet("users")] in AdminController
    const response = await apiClient.get('/admin/users');
    return response.data || []; // Expects UserDto[]: [{ id, firstName, lastName, email,... }]
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || "Failed to fetch users.";
    console.error("Error fetching admin users (adminUserService):", errorMsg, error.response || error);
    throw new Error(errorMsg);
  }
};

// Note: Functions for PDF/CSV download are direct links/API calls,
// so they might not need specific service functions if they are simple GET requests
// that trigger a file download. If they require specific handling or POST requests,
// then service functions would be appropriate.
// For simple GETs that download, direct <a> tags or window.open() can be used.
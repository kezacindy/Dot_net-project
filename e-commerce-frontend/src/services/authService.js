// src/services/authService.js
import apiClient from "./api";

export const login = async (credentials) => {
  try {
    console.log("authService: Attempting login with credentials:", credentials);
    const response = await apiClient.post("/auth/login", credentials);
    console.log("authService: Login API response data:", response.data);
    return response.data;
  } catch (error) {
    // Log detailed error information
    console.error(
      "authService: Login API error. Status:", error.response?.status,
      "Response Data:", error.response?.data,
      "Full error object:", error.response || error
    );
    throw error; // Re-throw for the component to handle UI
  }
};

export const register = async (userData) => {
  try {
    console.log("authService: Attempting registration with data:", userData);
    const response = await apiClient.post("/auth/register", userData);
    console.log("authService: Registration API response data:", response.data);
    return response.data; // Expects { Message: '...' } or similar on success
  } catch (error) {
    console.error(
      "authService: Registration API error. Status:", error.response?.status,
      "Response Data:", error.response?.data,
      "Full error object:", error.response || error
    );
    // Specifically log ASP.NET Core Identity validation errors if present
    if (error.response?.data?.errors) {
        console.error("Detailed Registration Validation Errors from backend (authService):", error.response.data.errors);
    }
    throw error; // Re-throw for the component to handle UI
  }
};

// forgotPassword and resetPassword remain the same
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post("/passwordReset/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password error (authService):", error.response?.data || error.message, error.response);
    throw error;
  }
};

export const resetPassword = async (resetData) => {
  try {
    const response = await apiClient.post("/passwordReset/reset-password", resetData);
    return response.data;
  } catch (error) {
    console.error("Reset password error (authService):", error.response?.data || error.message, error.response);
    throw error;
  }
};
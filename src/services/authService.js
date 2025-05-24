import apiClient from "./api";

export const login = async (credentials) => {
  try {
    // credentials should be an object like { email: '...', password: '...' }
    const response = await apiClient.post("/auth/login", credentials);
    return response.data; // Expects { email, firstName, token, roles, tokenExpiration }
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error; // Re-throw to be caught by the component
  }
};

export const register = async (userData) => {
  try {
    // userData should match RegisterDto { firstName, lastName, email, password }
    const response = await apiClient.post("/auth/register", userData);
    return response.data; // Expects { Message: '...' } on success
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

// Add forgotPassword, resetPassword functions later
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post("/passwordReset/forgot-password", {
      email,
    }); // Send as object
    return response.data;
  } catch (error) {
    console.error(
      "Forgot password error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const resetPassword = async (resetData) => {
  // resetData = { email, token, newPassword }
  try {
    const response = await apiClient.post(
      "/passwordReset/reset-password",
      resetData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Reset password error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Add Google login initiation later if needed
// export const initiateGoogleLogin = () => {
//   // Redirect the browser to the backend endpoint that starts the Google flow
//   window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/google-login`; // Example endpoint
// };

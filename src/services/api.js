import axios from "axios";

// Get the base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Fallback if .env is not set, or for environments where .env isn't used
const DEFAULT_API_URL = "http://localhost:5270/api"; // Your typical local development URL

if (!API_BASE_URL) {
  console.warn( // Use warn instead of error if you have a fallback
    `Warning: REACT_APP_API_BASE_URL is not defined in .env file. Using default: ${DEFAULT_API_URL}`
  );
}

const apiClient = axios.create({
  baseURL: API_BASE_URL || DEFAULT_API_URL, // Use .env variable or fallback
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Axios Interceptor for adding JWT Token ---
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    // console.log('AXIOS INTERCEPTOR - Sending token:', token, 'to URL:', config.baseURL + config.url); // For Debugging
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      // console.warn('AXIOS INTERCEPTOR - No token found for URL:', config.baseURL + config.url); // For Debugging
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Optional: Axios Interceptor for handling 401 Unauthorized ---
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('AXIOS INTERCEPTOR - Global 401: Unauthorized access. Token might be invalid/expired.');
      // Potentially trigger logout from AuthContext or redirect.
      // For now, just logging. A more robust solution would involve AuthContext.
      // localStorage.removeItem('authToken');
      // localStorage.removeItem('authUser');
      // if (window.location.pathname !== '/login') {
      //   window.location.href = '/login';
      // }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
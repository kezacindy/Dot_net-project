import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = 'authToken'; // Define constants for localStorage keys
const AUTH_USER_KEY = 'authUser';

export const AuthProvider = ({ children }) => {
  // Initialize state by trying to load from localStorage
  const getInitialToken = useCallback(() => localStorage.getItem(AUTH_TOKEN_KEY), []);
  const getInitialUser = useCallback(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Error parsing stored user data from localStorage", e);
      localStorage.removeItem(AUTH_USER_KEY); // Clear corrupted data
      return null;
    }
  }, []);

  const [token, setToken] = useState(getInitialToken());
  const [user, setUser] = useState(getInitialUser());
  // isAuthenticated should strictly depend on the presence of a token AND potentially user data
  // or a verified token. For simplicity now, token presence is the primary driver.
  const [isAuthenticated, setIsAuthenticated] = useState(!!getInitialToken());

  // Effect to update isAuthenticated when token changes
  // This also handles syncing state if localStorage is cleared externally (e.g. dev tools)
  useEffect(() => {
    const handleStorageChange = () => {
        const currentToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const currentUser = getInitialUser(); // Re-fetch user from storage
        setToken(currentToken);
        setUser(currentUser);
        setIsAuthenticated(!!currentToken);
    };

    // Initialize based on current storage (covers initial load and refreshes)
    handleStorageChange();

    // Listen for storage changes from other tabs/windows (optional but good for robustness)
    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [getInitialToken, getInitialUser]); // Dependencies for initial load logic


  const login = useCallback((authData) => {
    // authData from backend: { email, firstName, token, roles, tokenExpiration (optional) }
    if (!authData || !authData.token) {
        console.error("Login called with invalid authData", authData);
        return;
    }

    localStorage.setItem(AUTH_TOKEN_KEY, authData.token);
    const userToStore = {
        email: authData.email,
        firstName: authData.firstName,
        roles: Array.isArray(authData.roles) ? authData.roles : [], // Ensure roles is an array
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userToStore));

    setToken(authData.token);
    setUser(userToStore);
    setIsAuthenticated(true); // This will be set by the useEffect above, but explicit set is fine
    console.log("User logged in:", authData.email, "Roles:", userToStore.roles);
  }, []); // No dependencies, as it only uses its arguments and localStorage

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false); // This will be set by the useEffect above
    console.log("User logged out");
    // Navigation should be handled by the component calling logout
  }, []); // No dependencies

  const isAdmin = useCallback(() => {
    // Check if user exists, has roles, and 'Admin' is one of them
    return !!user && Array.isArray(user.roles) && user.roles.includes('Admin');
  }, [user]); // Depends on the user object

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) { // Changed condition to handle undefined or null
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
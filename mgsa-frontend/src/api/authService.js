import API from "./axios";

/**
 * Authentication Service
 * Handles user registration, login, and logout operations
 * Integrated with real backend API endpoints
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.fname - First name
 * @param {string} userData.lname - Last name
 * @param {string} userData.phone - Phone number
 * @returns {Promise<Object>} Registration result with token and user data
 */
export const registerUser = async (userData) => {
  try {
    // Call real backend API
    const response = await API.post("/auth/register", userData);
    
    // Backend returns: { message: "User registered successfully" }
    console.log("Registration response:", response.data.message);
    
    // After registration, automatically log the user in
    const loginResult = await loginUser(userData.email, userData.password);
    
    if (!loginResult.success) {
      throw new Error("Registration successful but auto-login failed. Please login manually.");
    }

    return loginResult;
  } catch (error) {
    console.error("Registration error:", error);
    
    // Extract error message from backend response
    const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again.";
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login result with token and user data
 */
export const loginUser = async (email, password) => {
  try {
    // Validate inputs
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    // Call real backend API
    const response = await API.post("/auth/login", { email, password });
    
    // Backend returns: { token, user: { id, name, email, role } }
    const { token, user } = response.data;

    // Store token and user in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return {
      success: true,
      token: token,
      user: user,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Login error:", error);
    
    // Extract error message from backend response
    const errorMessage = error.response?.data?.message || error.message || "Login failed. Please check your credentials.";
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Logout current user
 * Clears all data from localStorage
 * @returns {Promise<Object>} Logout result
 */
export const logoutUser = async () => {
  try {
    // Clear all localStorage data
    localStorage.clear();

    return {
      success: true,
      message: "Logout successful",
    };
  } catch (error) {
    console.error("Logout error:", error);
    
    // Even if error occurs, clear local storage
    localStorage.clear();

    return {
      success: true,
      message: "Logout successful",
    };
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    // Get user from localStorage (token is auto-attached by axios interceptor)
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userStr || !token) {
      return {
        success: false,
        message: "No authenticated user",
      };
    }

    const user = JSON.parse(userStr);

    return {
      success: true,
      user: user,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return {
      success: false,
      message: error.message || "Failed to get user data",
    };
  }
};

/**
 * Verify if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

/**
 * Get stored authentication token
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Get stored user data
 * @returns {Object|null} User object or null
 */
export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

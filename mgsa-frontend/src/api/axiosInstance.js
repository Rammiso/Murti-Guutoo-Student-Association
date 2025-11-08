import axios from "axios";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  // Development baseURL - change to production URL when deploying
  baseURL: "https://murti-guutoo-student-association.onrender.com/api",
  // Production baseURL (uncomment when deploying):
  // baseURL: "https://api.mgsa.org",

  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add JWT token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor to handle common response scenarios
axiosInstance.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access forbidden:", error.response.data.message);
          break;
        case 404:
          // Not found
          console.error("Resource not found:", error.response.data.message);
          break;
        case 500:
          // Server error
          console.error("Server error:", error.response.data.message);
          break;
        default:
          console.error("API error:", error.response.data.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response from server. Please check your connection.");
    } else {
      // Something else happened
      console.error("Request error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./auth-context";
import { registerUser, loginUser, logoutUser } from "../api/authService";

/**
 * AuthProvider Component
 * Manages authentication state and provides auth functions to the app
 * 
 * Integration Notes:
 * - Integrated with real backend API via authService
 * - Token and user data stored in localStorage for persistence
 * - Auto-redirects based on user role (admin -> /admin, student -> /)
 * - JWT token automatically attached to all API requests via Axios interceptor
 */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Auto-restore user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // If token or user is missing, logout automatically
    if (!storedToken || !storedUser) {
      if (storedToken || storedUser) {
        // Partial data - clear everything
        localStorage.clear();
        console.log("Incomplete session data - cleared localStorage");
      }
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      
      // Validate user object has required fields
      if (!parsedUser.id || !parsedUser.email || !parsedUser.role) {
        throw new Error("Invalid user data structure");
      }

      setToken(storedToken);
      setUser(parsedUser);
      console.log("✅ User session restored:", {
        email: parsedUser.email,
        role: parsedUser.role,
        isAdmin: parsedUser.role === "admin"
      });
    } catch (error) {
      console.error("❌ Failed to restore user session:", error);
      // Clear invalid data
      localStorage.clear();
    }
    
    setLoading(false);
  }, []);

  // Login function - calls real backend API via authService
  const login = async (email, password, redirectTo = null) => {
    try {
      setLoading(true);

      // Call authService login function (real backend API)
      const result = await loginUser(email, password);

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      // Extract token and user from response
      const { token: newToken, user: newUser } = result;

      // Validate user data
      if (!newUser.role) {
        throw new Error("Invalid user data: missing role");
      }

      // authService already stores in localStorage, but we update state
      setToken(newToken);
      setUser(newUser);

      // Determine if user is admin
      const isAdminUser = newUser.role === "admin";

      // Log successful login
      console.log("✅ User logged in:", {
        email: newUser.email,
        role: newUser.role,
        isAdmin: isAdminUser,
        id: newUser.id,
      });

      // Redirect based on role
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        // Admin → /admin, Student → /profile
        const destination = isAdminUser ? "/admin" : "/profile";
        console.log(`🚀 Redirecting ${newUser.role} to ${destination}`);
        navigate(destination);
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function - calls real backend API via authService
  const register = async (userData, redirectTo = null) => {
    try {
      setLoading(true);

      // Call authService register function (real backend API)
      const result = await registerUser(userData);

      if (!result.success) {
        throw new Error(result.message || "Registration failed");
      }

      // Extract token and user from response
      const { token: newToken, user: newUser } = result;

      // authService already stores in localStorage, but we update state
      setToken(newToken);
      setUser(newUser);

      // Log successful registration
      console.log("✅ Registration successful:", {
        email: newUser.email,
        name: `${newUser.fname || ''} ${newUser.lname || ''}`.trim(),
        role: newUser.role,
        id: newUser.id,
      });

      // Redirect to profile after registration
      navigate(redirectTo || "/profile");
    } catch (error) {
      console.error("❌ Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function - clears local authentication state
  const logout = async () => {
    try {
      // Call authService logout function (clears localStorage)
      await logoutUser();

      // Reset state
      setToken(null);
      setUser(null);

      console.log("✅ User logged out successfully");

      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Even if logout fails, clear local state
      setToken(null);
      setUser(null);
      localStorage.clear();
      navigate("/login");
    }
  };

  // Helper to check if user is authenticated
  const isAuthenticated = !!user && !!token;

  // Helper to check if user is admin
  const isAdmin = user?.role === "admin";

  // Get user role
  const role = user?.role || null;

  const value = {
    user,
    token,
    role,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/auth-context";
import AccessDenied from "../pages/AccessDenied";

/**
 * ProtectedRoute Component
 * Protects routes by verifying JWT token and user authentication
 * Supports role-based access control (admin, student)
 * 
 * @param {ReactNode} children - Protected content to render
 * @param {string} role - Required role ("admin" or "student")
 */
const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isAdmin, token } = useAuth();
  const location = useLocation();

  // Verify JWT token presence and user authentication
  const hasValidToken = !!token && !!user;

  // Show smooth loading state while checking authentication
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#22C55E]/30 border-t-[#22C55E] rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-700 font-semibold text-lg"
          >
            Verifying access...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // Redirect to login if no valid token or user, save attempted location
  if (!hasValidToken) {
    console.log("No valid token found, redirecting to login");
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Role-based access control
  if (role && user.role !== role) {
    console.log(`Access denied: User role "${user.role}" does not match required role "${role}"`);
    
    // Admin trying to access student pages - redirect to admin dashboard
    if (user.role === "admin" && role === "student") {
      return <Navigate to="/admin" replace />;
    }
    
    // Student trying to access admin pages - show access denied
    if (user.role === "student" && role === "admin") {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <AccessDenied type="unauthorized" />
          </motion.div>
        </AnimatePresence>
      );
    }
    
    // Other role mismatches - show access denied
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <AccessDenied type="unauthorized" />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Render protected content with smooth transition
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProtectedRoute;

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Futuristic Info Item Component
const InfoItem = ({ icon, label, value, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, ease: "easeOut", delay }}
    className="group relative rounded-2xl bg-gradient-to-br from-[#0B0E14]/80 to-[#1a1f2e]/80 backdrop-blur-xl p-5 border border-[#22C55E]/20 hover:border-[#22C55E]/60 transition-all duration-300 overflow-hidden"
  >
    {/* Glow effect on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/0 to-[#22C55E]/0 group-hover:from-[#22C55E]/10 group-hover:to-[#00FFC6]/10 transition-all duration-300" />

    <div className="relative flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22C55E]/20 to-[#00FFC6]/20 border border-[#22C55E]/30 grid place-items-center text-[#22C55E] group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs uppercase tracking-widest text-[#22C55E]/70 font-semibold mb-1">
          {label}
        </p>
        <p className="text-base font-medium text-[#E0E0E0] group-hover:text-white transition-colors">
          {value}
        </p>
      </div>
    </div>
  </motion.div>
);

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const fileInputRef = useRef(null);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      // Redirect if no token
      if (!token) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Unable to load your profile. Please try again.");
        setLoading(false);

        // Handle 401 - redirect to login
        if (err.response?.status === 401) {
          localStorage.clear();
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  // Loading State with Futuristic Animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0E14] via-[#0F1419] to-[#0B0E14] flex items-center justify-center relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#22C55E]/30 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Loading spinner */}
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-[#22C55E]/20 border-t-[#22C55E] rounded-full mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-[#E0E0E0] tracking-wide"
          >
            Loading your profile<span className="animate-pulse">...</span>
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-4 h-1 w-48 bg-gradient-to-r from-[#22C55E] to-[#00FFC6] rounded-full mx-auto"
          />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0E14] via-[#0F1419] to-[#0B0E14] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] rounded-2xl border-2 border-red-500/50 p-8 text-center"
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full grid place-items-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 text-red-500"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-[#E0E0E0] mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#22C55E]/50 transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Handle profile picture upload
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setToast({ show: true, message: "Only JPEG, PNG, and WebP images are allowed", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({ show: true, message: "File size must be less than 5MB", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("profilePic", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/profile-pic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // Update profile with new Cloudinary URL
        setProfile((prev) => (prev ? { ...prev, profilePicUrl: response.data.profilePicUrl } : prev));
        setToast({ show: true, message: "Profile picture updated successfully", type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setToast({ 
        show: true, 
        message: err.response?.data?.message || err.response?.data?.error || "Upload failed. Try again.", 
        type: "error" 
      });
      setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Profile loaded successfully
  const firstName = profile?.fname || "User";
  const middleName = profile?.mname || "";
  const fullName = `${firstName} ${middleName}`.trim();
  const email = profile?.email || "";
  
  // Use Cloudinary URL directly if it exists, otherwise show placeholder
  const hasProfilePic = Boolean(profile?.profilePicUrl);
  const canUpload = !hasProfilePic;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0E14] via-[#0F1419] to-[#0B0E14] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-[#22C55E]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-[#00FFC6]/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#22C55E] to-[#00FFC6] bg-clip-text text-transparent mb-2 drop-shadow-[0_0_30px_#22C55E]">
            Welcome Back
          </h1>
          <p className="text-[#E0E0E0]/70 text-lg">Your Profile Dashboard</p>
        </motion.div>

        {/* Profile Card */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative rounded-3xl bg-gradient-to-br from-[#1a1f2e]/90 to-[#0f1419]/90 backdrop-blur-2xl border-2 border-[#22C55E]/30 shadow-2xl shadow-[#22C55E]/20 p-8 md:p-12 overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/5 to-[#00FFC6]/5 pointer-events-none" />

            {/* Profile Header */}
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
              {/* Profile Picture */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative group"
              >
                <div className="relative w-32 h-32 md:w-40 md:h-40">
                  {/* Neon glowing border */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#22C55E] to-[#00FFC6] p-[3px] animate-pulse">
                    <div className="w-full h-full rounded-full bg-[#0B0E14]" />
                  </div>
                  
                  {/* Profile Image / Placeholder */}
                  {hasProfilePic ? (
                    <img
                      src={profile.profilePicUrl}
                      alt={fullName}
                      className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full object-cover shadow-lg shadow-[#22C55E]/30"
                    />
                  ) : (
                    <div className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border border-[#22C55E]/40 shadow-lg shadow-[#22C55E]/20 grid place-items-center text-center px-4">
                      <span className="text-xs font-semibold tracking-wide text-[#22C55E]/80">No Image</span>
                    </div>
                  )}
                  
                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br transition-all duration-300 ${
                    canUpload
                      ? "from-[#22C55E]/0 to-[#00FFC6]/0 group-hover:from-[#22C55E]/20 group-hover:to-[#00FFC6]/20"
                      : "from-transparent to-transparent"
                  }`} />
                  
                  {/* Upload overlay on hover */}
                  {canUpload && (
                    <label
                      htmlFor="profile-pic-input"
                      className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-10 h-10 text-[#22C55E]"
                      >
                        <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                      </svg>
                    </label>
                  )}
                  <input
                    id="profile-pic-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProfilePicUpload}
                    className="hidden"
                    disabled={uploading || !canUpload}
                  />
                </div>
                
                {/* Upload button below image */}
                {canUpload && (
                  <motion.label
                    htmlFor="profile-pic-input"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 block w-full px-4 py-2 rounded-full bg-gradient-to-r from-[#22C55E] to-[#00FFC6] text-white font-semibold text-sm text-center cursor-pointer shadow-lg shadow-[#22C55E]/50 hover:shadow-[#22C55E]/70 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#22C55E]/50 to-[#00FFC6]/50 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">
                      {uploading ? "Uploading..." : "Upload Picture"}
                    </span>
                  </motion.label>
                )}
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold text-[#E0E0E0] mb-2"
                >
                  {fullName}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#22C55E] text-lg mb-4 break-all"
                >
                  {email}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#22C55E]/20 to-[#00FFC6]/20 border border-[#22C55E]/40"
                >
                  <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
                  <span className="text-[#E0E0E0] font-semibold">
                    {profile?.role === "admin" ? "Administrator" : "Student"}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-[2px] bg-gradient-to-r from-transparent via-[#22C55E]/50 to-transparent mb-10"
            />

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                }
                label="Zone"
                value={profile?.zone || "Not available"}
                delay={0.1}
              />
              <InfoItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                }
                label="Woreda"
                value={profile?.woreda || "Not available"}
                delay={0.15}
              />
              <InfoItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                  </svg>
                }
                label="College"
                value={profile?.college || "Not available"}
                delay={0.2}
              />
              <InfoItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                  </svg>
                }
                label="Department"
                value={profile?.department || "Not available"}
                delay={0.25}
              />
              <InfoItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                  </svg>
                }
                label="Year of Study"
                value={profile?.year || "Not available"}
                delay={0.3}
              />
              <InfoItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                }
                label="Gender"
                value={profile?.gender || "Not available"}
                delay={0.35}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-[#E0E0E0]/50"
        >
          <p>
            &copy; {new Date().getFullYear()} Murti Guutoo Students Association
          </p>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 right-6 z-50 max-w-sm"
          >
            <div
              className={`rounded-2xl backdrop-blur-xl p-4 border-2 shadow-2xl ${
                toast.type === "success"
                  ? "bg-gradient-to-br from-[#22C55E]/90 to-[#16A34A]/90 border-[#22C55E] shadow-[#22C55E]/50"
                  : "bg-gradient-to-br from-red-500/90 to-red-600/90 border-red-500 shadow-red-500/50"
              }`}
            >
              <div className="flex items-center gap-3">
                {toast.type === "success" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                )}
                <p className="text-white font-semibold text-sm">{toast.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;

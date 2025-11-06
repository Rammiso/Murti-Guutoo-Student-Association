import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Verification, 2 = Reset Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Step 1 fields
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [phone, setPhone] = useState("");
  const [tempToken, setTempToken] = useState("");

  // Step 2 fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Step 1: Verify user details
  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !fname || !phone) {
      setError("All fields are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);

    try {
      console.log("🔍 [FORGOT PASSWORD] Sending verification request...");
      console.log(
        "📍 Endpoint:",
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`
      );
      console.log("📦 Payload:", { email, fname, phone });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, fname, phone }),
        }
      );

      console.log("📡 Response Status:", response.status);
      console.log("📋 Response Headers:", {
        contentType: response.headers.get("content-type"),
        server: response.headers.get("server"),
      });

      // Check content-type before parsing
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        // Backend returned non-JSON (likely HTML error page)
        const responseText = await response.text();
        console.error("❌ Backend returned HTML instead of JSON");
        console.error(
          "📄 Response Text (first 500 chars):",
          responseText.substring(0, 500)
        );

        throw new Error(
          "Server error – please check your connection or credentials. The server may be down or the endpoint may not exist."
        );
      }

      // Safe to parse JSON
      const data = await response.json();
      console.log("✅ Parsed JSON Response:", data);

      if (!response.ok) {
        console.warn("⚠️ Request failed with status:", response.status);
        throw new Error(data.message || "Verification failed");
      }

      // Store the temporary token
      console.log("🎫 Token received, moving to Step 2");
      setTempToken(data.tempToken);
      setStep(2); // Move to Step 2
    } catch (err) {
      console.error("💥 Error in handleVerification:", err);

      // Provide user-friendly error message
      if (err.message.includes("Failed to fetch")) {
        setError("Network error – please check your internet connection.");
      } else if (err.message.includes("Server error")) {
        setError(err.message);
      } else {
        setError(err.message || "Failed to verify details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      console.log("🔐 [RESET PASSWORD] Sending password reset request...");
      console.log(
        "📍 Endpoint:",
        `${import.meta.env.VITE_API_URL}/auth/reset-password`
      );
      console.log("📦 Payload:", {
        tempToken: "***",
        newPassword: "***",
        confirmPassword: "***",
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tempToken, newPassword, confirmPassword }),
        }
      );

      console.log("📡 Response Status:", response.status);
      console.log("📋 Response Headers:", {
        contentType: response.headers.get("content-type"),
        server: response.headers.get("server"),
      });

      // Check content-type before parsing
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        // Backend returned non-JSON (likely HTML error page)
        const responseText = await response.text();
        console.error("❌ Backend returned HTML instead of JSON");
        console.error(
          "📄 Response Text (first 500 chars):",
          responseText.substring(0, 500)
        );

        throw new Error(
          "Server error – please check your connection. The server may be down or the endpoint may not exist."
        );
      }

      // Safe to parse JSON
      const data = await response.json();
      console.log("✅ Parsed JSON Response:", data);

      if (!response.ok) {
        console.warn("⚠️ Request failed with status:", response.status);
        throw new Error(data.message || "Password reset failed");
      }

      console.log("🎉 Password reset successful!");
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("💥 Error in handlePasswordReset:", err);

      // Provide user-friendly error message
      if (err.message.includes("Failed to fetch")) {
        setError("Network error – please check your internet connection.");
      } else if (err.message.includes("Server error")) {
        setError(err.message);
      } else {
        setError(err.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B0E14] via-[#1a1f2e] to-[#0f1419]"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(0, 255, 198, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      {/* Floating Orbs */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-20 left-20 w-96 h-96 bg-[#22C55E]/10 blur-3xl rounded-full"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="pointer-events-none absolute bottom-20 right-20 w-96 h-96 bg-[#00FFC6]/10 blur-3xl rounded-full"
      />

      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-[90%] max-w-[450px] rounded-2xl border-2 border-[#22C55E]/30 bg-gradient-to-br from-[#1a1f2e]/90 to-[#0f1419]/90 backdrop-blur-xl shadow-2xl shadow-[#22C55E]/10 p-8 md:p-10"
      >
        {/* Glowing Border Effect */}
        <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#22C55E]/20 via-[#00FFC6]/20 to-[#22C55E]/20 blur-sm" />

        <div className="relative">
          {/* Logo with Pulse Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center mb-6"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.3)",
                  "0 0 40px rgba(34, 197, 94, 0.5)",
                  "0 0 20px rgba(34, 197, 94, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#22C55E] to-[#00FFC6] flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="text-white" size={32} />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-[#22C55E] via-[#00FFC6] to-[#22C55E] bg-clip-text text-transparent mb-2"
          >
            {success
              ? "Success!"
              : step === 1
              ? "Forgot Password"
              : "Reset Password"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-gray-400 text-sm mb-8"
          >
            {success
              ? "Your password has been reset successfully"
              : step === 1
              ? "Enter your details to verify your identity"
              : "Create a new password for your account"}
          </motion.p>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-4"
                >
                  <CheckCircle className="text-[#22C55E]" size={64} />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#22C55E] text-lg font-semibold text-center"
                >
                  ✅ Password reset successfully!
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-400 text-sm mt-2 text-center"
                >
                  Redirecting to login...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1: Verification Form */}
          {!success && step === 1 && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleVerification}
              className="space-y-5"
            >
              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#22C55E] transition-colors"
                    size={20}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#0B0E14]/50 border-2 border-[#22C55E]/30 rounded-xl text-[#E0E0E0] placeholder-gray-500 outline-none focus:border-[#22C55E] focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* First Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#22C55E] transition-colors"
                    size={20}
                  />
                  <input
                    type="text"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#0B0E14]/50 border-2 border-[#22C55E]/30 rounded-xl text-[#E0E0E0] placeholder-gray-500 outline-none focus:border-[#22C55E] focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Phone Number Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#22C55E] transition-colors"
                    size={20}
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#0B0E14]/50 border-2 border-[#22C55E]/30 rounded-xl text-[#E0E0E0] placeholder-gray-500 outline-none focus:border-[#22C55E] focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="p-4 rounded-xl bg-red-500/10 border-2 border-red-500/50 text-red-400 text-sm text-center shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Verify Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{
                  scale: loading ? 1 : 1.02,
                  boxShadow: loading
                    ? "0 10px 40px rgba(34, 197, 94, 0.3)"
                    : [
                        "0 10px 40px rgba(34, 197, 94, 0.3)",
                        "0 10px 60px rgba(34, 197, 94, 0.5)",
                        "0 10px 40px rgba(34, 197, 94, 0.3)",
                      ],
                }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className="relative w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#00FFC6] text-white font-bold text-lg shadow-lg shadow-[#22C55E]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                {/* Animated Glow Effect */}
                <motion.div
                  animate={{
                    x: loading ? ["-100%", "100%"] : "0%",
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: loading ? Infinity : 0,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />

                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="relative w-6 h-6">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 border-3 border-transparent border-t-white rounded-full"
                          style={{
                            boxShadow:
                              "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(34, 197, 94, 0.6)",
                          }}
                        />
                      </div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Identity</span>
                      <ArrowRight size={22} />
                    </>
                  )}
                </span>
              </motion.button>
            </motion.form>
          )}

          {/* Step 2: Password Reset Form */}
          {!success && step === 2 && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handlePasswordReset}
              className="space-y-5"
            >
              {/* New Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#22C55E] transition-colors"
                    size={20}
                  />
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-12 pr-12 py-3.5 bg-[#0B0E14]/50 border-2 border-[#22C55E]/30 rounded-xl text-[#E0E0E0] placeholder-gray-500 outline-none focus:border-[#22C55E] focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
                  />
                  <button
                    type="button"
                    aria-label={showNewPass ? "Hide password" : "Show password"}
                    onClick={() => setShowNewPass((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#22C55E] hover:scale-110 transition-all duration-300"
                  >
                    {showNewPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#22C55E] transition-colors"
                    size={20}
                  />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-12 pr-12 py-3.5 bg-[#0B0E14]/50 border-2 border-[#22C55E]/30 rounded-xl text-[#E0E0E0] placeholder-gray-500 outline-none focus:border-[#22C55E] focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirmPass ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowConfirmPass((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#22C55E] hover:scale-110 transition-all duration-300"
                  >
                    {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="p-4 rounded-xl bg-red-500/10 border-2 border-red-500/50 text-red-400 text-sm text-center shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reset Password Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{
                  scale: loading ? 1 : 1.02,
                  boxShadow: loading
                    ? "0 10px 40px rgba(34, 197, 94, 0.3)"
                    : [
                        "0 10px 40px rgba(34, 197, 94, 0.3)",
                        "0 10px 60px rgba(34, 197, 94, 0.5)",
                        "0 10px 40px rgba(34, 197, 94, 0.3)",
                      ],
                }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className="relative w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#00FFC6] text-white font-bold text-lg shadow-lg shadow-[#22C55E]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                {/* Animated Glow Effect */}
                <motion.div
                  animate={{
                    x: loading ? ["-100%", "100%"] : "0%",
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: loading ? Infinity : 0,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />

                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="relative w-6 h-6">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 border-3 border-transparent border-t-white rounded-full"
                          style={{
                            boxShadow:
                              "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(34, 197, 94, 0.6)",
                          }}
                        />
                      </div>
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <CheckCircle size={22} />
                    </>
                  )}
                </span>
              </motion.button>
            </motion.form>
          )}

          {/* Back to Login Link */}
          {!success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-400">
                Remember your password?{" "}
                <a
                  href="/login"
                  className="text-[#22C55E] hover:text-[#00FFC6] font-semibold transition-colors"
                >
                  Back to Login
                </a>
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;

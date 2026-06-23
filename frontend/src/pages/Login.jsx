import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from "lucide-react";

const Login = () => {
  const { login, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [emailWarning, setEmailWarning] = useState("");

  // Email validation handler with strict domain validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Only show warning if user has typed something
    if (value.length > 0) {
      // Basic email format check
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(value)) {
        setEmailWarning("Please enter a valid email address");
      } else {
        // Extract domain parts
        const emailParts = value.split('@');
        const fullDomain = emailParts[1]?.toLowerCase();
        const domainParts = fullDomain?.split('.');
        const domainName = domainParts?.[0]; // e.g., "gmail" from "gmail.com"
        const extension = domainParts?.[domainParts.length - 1]; // e.g., "com"

        // Valid extensions
        const validExtensions = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'co', 'io', 'ai', 'uk', 'us', 'ca', 'au', 'de', 'fr', 'in', 'jp', 'cn', 'br', 'ru', 'za', 'ng', 'ke', 'et'];

        // Common email providers (domain names) - ONLY these are allowed
        const commonProviders = [
          'gmail', 'yahoo', 'outlook', 'hotmail', 'live', 'msn', 'icloud', 'me',
          'aol', 'mail', 'protonmail', 'zoho', 'yandex', 'gmx', 'inbox',
          'fastmail', 'tutanota', 'hushmail', 'runbox', 'mailfence'
        ];
        
        // Check if extension is valid
        if (!extension || extension.length < 2 || !/^[a-z]+$/.test(extension)) {
          setEmailWarning("Invalid domain extension (e.g., .com, .org, .net)");
        } else if (!validExtensions.includes(extension)) {
          setEmailWarning("Please use a common email domain (e.g., gmail.com, yahoo.com)");
        } else if (!domainName || domainName.length < 3) {
          // Domain name too short or missing
          setEmailWarning("Domain name is too short. Use a valid email provider");
        } else if (!commonProviders.includes(domainName)) {
          // STRICT: Only accept recognized providers
          setEmailWarning("Please use a recognized email provider (gmail, yahoo, outlook, hotmail, etc.)");
        } else {
          setEmailWarning("");
        }
      }
    } else {
      setEmailWarning("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      // Get the redirect path from location state, if available
      const from = location.state?.from?.pathname || null;
      await login(email, password, from);
      // Navigation is handled by AuthContext
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
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

      {/* Glassmorphic Login Card */}
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
            Welcome Back to MGSA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-gray-400 text-sm mb-8"
          >
            Sign in to access your resources and dashboard
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-3.5 bg-[#0B0E14]/50 border-2 rounded-xl text-[#E0E0E0] placeholder-gray-500 outline-none transition-all duration-300 ${
                    emailWarning
                      ? "border-yellow-500/50 focus:border-yellow-500 focus:shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                      : "border-[#22C55E]/30 focus:border-[#22C55E] focus:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  }`}
                />
              </div>
              
              {/* Email Warning Message */}
              <AnimatePresence>
                {emailWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 flex items-center gap-2 text-yellow-400 text-xs"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 flex-shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{emailWarning}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#22C55E] transition-colors"
                  size={20}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-[#0B0E14]/50 border-2 border-[#22C55E]/30 rounded-xl text-[#E0E0E0] placeholder-gray-500 outline-none focus:border-[#22C55E] focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
                />
                <button
                  type="button"
                  aria-label={showPass ? "Hide password" : "Show password"}
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#22C55E] hover:scale-110 transition-all duration-300"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
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

            {/* Login Button */}
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
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 border-3 border-transparent border-b-[#00FFC6] rounded-full opacity-70"
                      />
                    </div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={22} />
                    <span>Login</span>
                  </>
                )}
              </span>
            </motion.button>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="space-y-3 mt-6"
            >
              <p className="text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#22C55E] hover:text-[#00FFC6] font-semibold transition-colors"
                >
                  Register
                </Link>
              </p>
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="text-center text-sm"
              >
                <Link
                  to="/forgot-password"
                  className="relative inline-block text-gray-400 hover:text-[#22C55E] font-medium transition-all duration-300 group"
                >
                  <span className="relative z-10">Forgot password?</span>
                  <motion.span
                    className="absolute inset-0 -z-10 blur-md opacity-0 group-hover:opacity-100 bg-[#22C55E]/30 rounded transition-opacity duration-300"
                  />
                </Link>
              </motion.p>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;

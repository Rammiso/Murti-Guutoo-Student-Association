import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { useMemo } from "react";

const AccessDenied = ({ type = "notfound" }) => {
  const navigate = useNavigate();
  const isUnauthorized = type === "unauthorized";

  // Configuration based on type
  const config = useMemo(() => {
    if (isUnauthorized) {
      return {
        icon: Lock,
        title: "Access Denied",
        subtitle: "You don't have permission to view this page.",
        description: "This area is restricted to administrators only. Please contact your system administrator if you believe this is an error.",
      };
    }
    return {
      icon: AlertTriangle,
      title: "Page Not Found",
      subtitle: "The page you're looking for doesn't exist.",
      description: "The URL may be mistyped or the page may have been moved. Please check the address and try again.",
    };
  }, [isUnauthorized]);

  const Icon = config.icon;

  // Particle animation data
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 10,
        size: Math.random() > 0.5 ? "w-1 h-1" : "w-2 h-2",
      })),
    []
  );

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E0E0E0] relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute ${particle.size} bg-[#22C55E]/30 rounded-full blur-sm`}
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0E14] via-[#0F1419] to-[#0B0E14] opacity-90" />

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 text-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            duration: 0.8,
          }}
          className="relative inline-block mb-8"
        >
          {/* Glowing Ring Animation */}
          <motion.div
            className="absolute inset-0 -m-4"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full rounded-full border-4 border-[#22C55E]/30 blur-md" />
          </motion.div>

          {/* Icon Container */}
          <div className="relative bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] p-8 rounded-full border-2 border-[#22C55E]/40 shadow-2xl shadow-[#22C55E]/20">
            <Icon
              size={80}
              className="text-[#22C55E] drop-shadow-[0_0_20px_#22C55E]"
            />
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#22C55E] to-[#00FFC6] bg-clip-text text-transparent drop-shadow-[0_0_30px_#22C55E]">
            {isUnauthorized ? "403" : "404"}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-4 text-[#E0E0E0] drop-shadow-[0_0_10px_#22C55E]"
        >
          {config.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-xl md:text-2xl text-gray-400 mb-4 font-medium"
        >
          {config.subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-sm md:text-base text-gray-500 mb-12 max-w-lg mx-auto leading-relaxed"
        >
          {config.description}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Go Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="group relative px-8 py-4 rounded-lg bg-gradient-to-r from-[#1a1f2e] to-[#0f1419] border-2 border-[#22C55E]/40 text-[#E0E0E0] font-semibold transition-all duration-300 hover:border-[#22C55E] hover:shadow-lg hover:shadow-[#22C55E]/50 flex items-center gap-3 min-w-[180px] justify-center"
          >
            <ArrowLeft
              size={20}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Go Back</span>
            <div className="absolute inset-0 rounded-lg bg-[#22C55E]/0 group-hover:bg-[#22C55E]/10 transition-all duration-300" />
          </motion.button>

          {/* Home Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="group relative px-8 py-4 rounded-lg bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-[#22C55E]/60 flex items-center gap-3 min-w-[180px] justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Home
              size={20}
              className="relative z-10 transition-transform group-hover:scale-110"
            />
            <span className="relative z-10">Home Page</span>
          </motion.button>
        </motion.div>

        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-12 h-[2px] bg-gradient-to-r from-transparent via-[#22C55E]/50 to-transparent"
        />

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-8 text-xs text-gray-600"
        >
          Murti Guuto Students Association
        </motion.p>
      </div>

      {/* Animated Corner Accents */}
      <motion.div
        className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-[#22C55E]/20"
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-[#22C55E]/20"
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
    </div>
  );
};

export default AccessDenied;

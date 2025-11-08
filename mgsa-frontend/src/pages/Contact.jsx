import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import axios from "axios";
import LeadershipTeam from "../components/LeadershipTeam";
import LOGO from "../assets/logo-updated.png";

const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    telegram: "",
    subject: "",
    message: "",
  });
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for token
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("❌ Please login to send a message.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        fullName: form.name,
        telegram: form.telegram,
        subject: form.subject,
        message: form.message,
        senderEmail: user?.email || "",
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/contact`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Success
      setSuccessMessage("✅ Message sent successfully!");
      setForm({ name: "", telegram: "", subject: "", message: "" });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "❌ Failed to send message. Please try again.";
      setErrorMessage(errorMsg);

      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Floating particles background */}
      <div
        className="particles fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="particle accent"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${12 + Math.random() * 8}s`,
            }}
          />
        ))}

        {/* Gradient accents */}
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-[#22C55E]/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 bg-[#16A34A]/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Hero */}
      <section className="relative z-10 text-center pt-12 md:pt-16 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-extrabold text-white"
        >
          Get in Touch with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#16A34A]">
            MGSA
          </span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full"
        />
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="mt-4 text-white/70 max-w-2xl mx-auto"
        >
          Have questions, suggestions, or need help? We'd love to hear from you.
        </motion.p>
      </section>

      {/* Main Card */}
      <section className="relative z-10 py-10 md:py-14">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative group rounded-2xl border border-[#22C55E]/20 bg-white/5 backdrop-blur-md p-6 md:p-8 shadow-2xl hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-500"
            >
              {/* Glow effect */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#22C55E]/20 via-[#16A34A]/20 to-[#22C55E]/20 blur opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Send us a message
                </h2>

                {/* Success Message */}
                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-4 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-sm font-medium flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {successMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#22C55E]/30 bg-[#0A0A0A]/60 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#22C55E]/70 focus:border-[#22C55E] transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Telegram Username *
                    </label>
                    <input
                      type="text"
                      name="telegram"
                      value={form.telegram}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#22C55E]/30 bg-[#0A0A0A]/60 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#22C55E]/70 focus:border-[#22C55E] transition-all"
                      placeholder="@yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Subject *
                    </label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#22C55E]/30 bg-[#0A0A0A]/60 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#22C55E]/70 focus:border-[#22C55E] transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Message *
                    </label>
                    <textarea
                      rows="5"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#22C55E]/30 bg-[#0A0A0A]/60 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#22C55E]/70 focus:border-[#22C55E] transition-all resize-none"
                      placeholder="Write your message here..."
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-semibold py-3 shadow-lg hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4"
            >
              {[
                {
                  title: "Location",
                  text: "Haramaya University, Oromia, Ethiopia",
                  hasLogo: true,
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z" />
                    </svg>
                  ),
                },
                {
                  title: "Telegram",
                  text: "HU Murti Gutoo Student's Association",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                  ),
                },
                {
                  title: "Phone",
                  text: "+251-912-345-678",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.05-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.24 1.05Z" />
                    </svg>
                  ),
                },
              ].map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: i * 0.1,
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden rounded-2xl border border-[#22C55E]/20 bg-white/5 backdrop-blur-md p-5 shadow-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
                >
                  {/* Logo watermark for location card */}
                  {c.hasLogo && (
                    <img
                      src={LOGO}
                      alt="MGSA Logo"
                      className="absolute right-2 bottom-2 w-20 h-20 opacity-10 pointer-events-none"
                    />
                  )}

                  <div className="relative flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 grid place-items-center text-[#22C55E]">
                      {c.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        {c.title}
                      </h4>
                      <p className="text-white/70 text-sm">{c.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <LeadershipTeam />
    </div>
  );
};

export default Contact;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Building2,
  Copy,
  Upload,
  CheckCircle,
  User,
  FileText,
  AlertCircle,
  GraduationCap,
  Users,
  Sparkles,
  Share2,
  QrCode,
  Mail,
  X,
  Heart,
} from "lucide-react";
import axios from "axios";
import QRCODE from "../assets/Commercial_Bank.png";
const PaymentForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    description: "",
    amount: "",
  });
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const bankDetails = {
    bankName: "Commercial Bank of Ethiopia (CBE)",
    accountNumber: "1000722101228",
    accountHolder: "Farida Mohammed and Murata Hassan",
    branch: "Main Branch",
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleShare = () => {
    const shareText = `Support MGSA! Bank: ${bankDetails.bankName}, Account: ${bankDetails.accountNumber}`;
    if (navigator.share) {
      navigator.share({ title: "MGSA Donation", text: shareText });
    } else {
      copyToClipboard(shareText);
      toast.success("Share details copied!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!screenshot) return toast.error("Please upload payment screenshot");
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(`${API_URL}/payments/submit`, {
        ...formData,
        screenshotUrl: screenshotPreview,
        paymentType: "donation",
      });
      if (response.data.success) {
        setShowSuccessModal(true);
        setFormData({ fullName: "", description: "", amount: "" });
        setScreenshot(null);
        setScreenshotPreview("");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Submission failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#111827] text-white overflow-x-hidden max-w-full">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#111827] pointer-events-none" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-emerald-400/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-cyan-400/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      {/* Subtle floating particles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-emerald-400/40 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-20 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-emerald-400/30 rounded-full animate-ping" />
        <div className="absolute bottom-10 right-1/3 w-2 h-2 bg-cyan-400/30 rounded-full animate-ping" />
        <div className="absolute top-16 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 py-16 px-4 w-full max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* MGSA Identity */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-cyan-200  md:text-7xl font-semibold text-sm tracking-widest uppercase">
              Murti Guuto Students Association
            </h1>
          </motion.div>

          {/* Neon Divider */}
          <div className="max-w-6xl mx-auto my-10">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
          </div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto text-center mb-8"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              Every contribution you make empowers{" "}
              <span className="text-cyan-400 font-semibold">
                {" "}
                Murti Guuto Student's Association
              </span>{" "}
              members to access quality education, build stronger communities,
              and create lasting positive change.
              <span className="text-cyan-400 font-semibold">
                {" "}
                Together, we rise.
              </span>
            </p>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-lg">
              Support Our Mission
            </h1>
            <p className="text-gray-400 text-lg">
              Transfer{" "}
              <span className="text-emerald-400 font-semibold">any amount</span>{" "}
              and upload your proof of payment below
            </p>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left - Bank Details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-[0_0_40px_rgba(34,197,94,0.08)]"
            >
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl font-semibold">Bank Account Details</h2>
              </div>

              <div className="space-y-5">
                {/* Bank Name */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Bank Name</p>
                  <p className="text-lg font-medium">{bankDetails.bankName}</p>
                </div>

                {/* Account Number */}
                <div className="bg-white/5 rounded-xl p-4 border border-cyan-500/40">
                  <p className="text-sm text-gray-400 mb-1">Account Number</p>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-semibold text-cyan-400">
                      {bankDetails.accountNumber}
                    </p>
                    <button
                      onClick={() => copyToClipboard(bankDetails.accountNumber)}
                      className="p-2 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition"
                    >
                      <Copy className="w-5 h-5 text-cyan-400" />
                    </button>
                  </div>
                </div>

                {/* Account Holder */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Account Name</p>
                  <p className="text-lg font-medium">
                    {bankDetails.accountHolder}
                  </p>
                </div>

                {/* Amount */}
                <div className="bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-xl p-4 border border-cyan-400/30">
                  <p className="text-sm text-gray-400 mb-1">
                    Amount to Transfer
                  </p>
                  <p className="text-2xl font-semibold text-cyan-400">
                    Any Amount You Wish
                  </p>
                  <p className="text-xs text-gray-300 mt-2">
                    Every contribution makes a difference! 💙
                  </p>
                </div>
              </div>

              {/* QR Code & Action Buttons */}
              <div className="mt-6 bg-white/5 border border-cyan-500/20 rounded-2xl p-4">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* QR Code Placeholder */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-white/10 rounded-xl border-2 border-cyan-400/30 flex items-center justify-center">
                      {/* <QrCode className="w-16 h-16 text-cyan-400/50" /> */}
                      {/* Replace with actual QR code image:*/}
                      <img
                        src={QRCODE}
                        alt="Payment QR"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {/* <p className="text-xs text-gray-400 text-center mt-2">
                      Scan to pay
                    </p> */}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-1 space-y-3 w-full">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(bankDetails.accountNumber)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-all duration-300 text-cyan-400 font-medium"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Account Number
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-all duration-300 text-blue-400 font-medium"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-cyan-400">
                  <AlertCircle className="w-5 h-5" /> Instructions
                </h3>
                <ol className="space-y-3 text-gray-300 text-sm">
                  {[
                    "Transfer any amount to the account above",
                    "Take a screenshot of the transfer confirmation",
                    "Fill the form below and upload screenshot",
                    "We’ll verify your payment shortly",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="w-6 h-6 bg-cyan-500 text-black rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-[0_0_40px_rgba(34,197,94,0.08)]"
            >
              <h2 className="text-2xl font-semibold mb-6 text-cyan-400">
                Submit Payment Proof
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm mb-2 text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#0b1322]/60 border border-cyan-500/30 rounded-xl focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.3)] outline-none text-white placeholder-gray-400 transition"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm mb-2 text-gray-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-[#0b1322]/60 border border-cyan-500/30 rounded-xl focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.3)] outline-none resize-none text-white placeholder-gray-400 transition"
                    placeholder="Payment description or purpose..."
                  />
                </div>

                {/* Amount Sent */}
                <div>
                  <label className="block text-sm mb-2 text-gray-300 flex items-center gap-2">
                    <span className="text-cyan-400">💰</span> Amount Sent (ETB)
                    *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="1"
                    step="0.01"
                    className="w-full px-4 py-3 bg-[#0b1322]/60 border border-cyan-500/30 rounded-xl focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.3)] outline-none text-white placeholder-gray-400 transition"
                    placeholder="Enter amount sent (e.g., 500)"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Enter the exact amount you transferred
                  </p>
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-sm mb-2 text-gray-300 flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Payment Screenshot *
                  </label>
                  <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-6 text-center hover:border-cyan-400/60 transition">
                    {screenshotPreview ? (
                      <div className="space-y-4">
                        <img
                          src={screenshotPreview}
                          alt="Screenshot preview"
                          className="max-h-64 mx-auto rounded-lg shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshot(null);
                            setScreenshotPreview("");
                          }}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <Upload className="w-12 h-12 mx-auto mb-2 text-cyan-400" />
                        <p className="text-gray-300 mb-1">
                          Click to upload screenshot
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 5MB
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="hidden"
                          required
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#E8617D] to-rose-500 rounded-xl font-semibold text-lg shadow-[0_0_25px_rgba(232,97,125,0.45)] hover:shadow-[0_0_35px_rgba(232,97,125,0.6)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Submit Payment Proof
                    </span>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Where Your Donation Goes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16 mt-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-cyan-400">
              Where Your Donation Goes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  icon: <GraduationCap className="w-8 h-8" />,
                  title: "Academic Support",
                  description:
                    "Tutorial programs, study materials, and scholarships for students in need.",
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Community Projects",
                  description:
                    "Outreach initiatives, mentorship programs, and social impact activities.",
                },
                {
                  icon: <Sparkles className="w-8 h-8" />,
                  title: "Events & Training",
                  description:
                    "Leadership workshops, skill development sessions, and networking events.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 shadow-[0_0_30px_rgba(0,255,255,0.1)]"
                >
                  <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-4 mx-auto">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 text-center">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm text-center leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Impact / Thank You Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(34,197,94,0.08)]"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 grid place-items-center"
              >
                <Heart className="w-7 h-7 text-[#E8617D]" />
              </motion.div>
            </div>
            <blockquote className="text-xl md:text-2xl font-semibold text-slate-100 mb-4">
              “Together, we build a brighter future for every Hararghe student.”
            </blockquote>
            <p className="text-gray-300 mb-6">
              Your generosity directly supports programs that uplift students
              through education, mentorship, and community-driven initiatives.
            </p>
            <a
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E8617D] to-rose-500 text-white font-semibold shadow-[0_0_20px_rgba(232,97,125,0.4)] hover:shadow-[0_0_28px_rgba(232,97,125,0.55)] transition"
            >
              Learn More About MGSA Programs
            </a>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-md border border-cyan-500/20 rounded-full">
              <Mail className="w-4 h-4 text-cyan-400" />
              <p className="text-gray-300 text-sm">
                Questions? Contact our finance team at{" "}
                <a
                  href="mailto:finance.mgsa@gmail.com"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  finance.mgsa@gmail.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-[#0f172a] border-2 border-cyan-400/50 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,255,255,0.4)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>

              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400/20 blur-2xl rounded-full" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-400 to-green-400 rounded-full flex items-center justify-center">
                    <Heart className="w-10 h-10 text-white animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <h3 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Thank You for Your Contribution!
              </h3>
              <p className="text-gray-300 text-center mb-6 leading-relaxed">
                Your payment has been submitted successfully. Our finance team
                will verify it shortly and you'll be notified once confirmed.
              </p>

              {/* Impact Message */}
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6">
                <p className="text-cyan-400 text-sm text-center font-medium">
                  Your generosity helps empower MGSA students to achieve their
                  dreams and build a brighter future. 🌟
                </p>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentForm;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Mail,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  MessageSquare,
  Send,
  AlertCircle,
  Menu,
  X,
  Home,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/auth-context";

const AdminMessages = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/contact`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("⚠️ Unable to load messages.");
      setLoading(false);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setTimeout(() => navigate("/login"), 2000);
      }
    }
  };

  const handleDeleteClick = (message) => {
    setMessageToDelete(message);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;

    const token = localStorage.getItem("token");
    setDeleteLoading(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/contact/${messageToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(messages.filter((m) => m._id !== messageToDelete._id));
      setToastMessage("🗑️ Message deleted!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDeleteModalOpen(false);
      setMessageToDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
      setToastMessage("❌ Failed to delete message.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLogout = () => {
    logout();
    setToastMessage("✅ Logged out successfully!");
    setShowToast(true);
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E0E0E0]">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#0F1419] to-[#0B0E14] border-r border-[#22C55E]/20 z-50 shadow-2xl shadow-[#22C55E]/10"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#00FFC6] bg-clip-text text-transparent">
                  MGSA Admin
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-[#E0E0E0] hover:text-[#22C55E] transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => navigate("/admin")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[#E0E0E0] hover:bg-[#22C55E]/10 hover:text-[#22C55E] transition-all"
                >
                  <Home size={20} />
                  Dashboard Overview
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] transition-all"
                >
                  <Mail size={20} />
                  Messages
                </button>
                <button
                  onClick={() => navigate("/admin")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[#E0E0E0] hover:bg-[#22C55E]/10 hover:text-[#22C55E] transition-all"
                >
                  <Settings size={20} />
                  Admin Management
                </button>
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !deleteLoading && setDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a2e] border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <AlertCircle className="text-red-500" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Delete Message</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this message? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#0B0E14]/95 backdrop-blur-sm border-b border-[#22C55E]/20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-[#E0E0E0] hover:text-[#22C55E] transition-colors"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-[#E0E0E0]">
                    📩 Messages
                  </h1>
                  <p className="text-sm text-gray-400">
                    View and manage student messages
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30">
                <Mail className="text-[#22C55E]" size={20} />
                <span className="text-[#22C55E] font-semibold">
                  Total: {messages.length}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8">
      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-white/5 animate-pulse border border-[#22C55E]/10"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center"
        >
          <AlertCircle className="mx-auto mb-3 text-red-500" size={48} />
          <p className="text-red-400 text-lg">{error}</p>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center">
            <MessageSquare className="text-[#22C55E]" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-300 mb-2">
            ✨ No messages received yet
          </h3>
          <p className="text-gray-500">
            Messages from students will appear here
          </p>
        </motion.div>
      )}

      {/* Messages List */}
      {!loading && !error && messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              {/* Main Card */}
              <div className="relative rounded-xl border border-[#22C55E]/20 bg-white/5 backdrop-blur-md overflow-hidden hover:border-[#22C55E]/40 transition-all duration-300">
                {/* Glow effect */}
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#22C55E]/0 via-[#22C55E]/10 to-[#22C55E]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" />

                <div className="relative p-4 md:p-6">
                  {/* Desktop Table View */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                    {/* Full Name */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center">
                        <User className="text-[#22C55E]" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{message.fullName}</p>
                        <p className="text-xs text-gray-400">{message.senderEmail}</p>
                      </div>
                    </div>

                    {/* Telegram */}
                    <div className="col-span-2">
                      <p className="text-sm text-gray-300">{message.telegram}</p>
                    </div>

                    {/* Subject */}
                    <div className="col-span-3">
                      <p className="text-sm text-white font-medium truncate">{message.subject}</p>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar size={16} />
                      {formatDate(message.createdAt)}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center gap-2 justify-end">
                      <button
                        onClick={() => toggleExpand(message._id)}
                        className="p-2 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/20 transition-all"
                        title={expandedId === message._id ? "Hide message" : "View message"}
                      >
                        {expandedId === message._id ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(message)}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-all"
                        title="Delete message"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center">
                          <User className="text-[#22C55E]" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{message.fullName}</p>
                          <p className="text-xs text-gray-400">{message.telegram}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleExpand(message._id)}
                          className="p-2 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]"
                        >
                          {expandedId === message._id ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(message)}
                          className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{message.subject}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Message */}
                  <AnimatePresence>
                    {expandedId === message._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-[#22C55E]/20">
                          <div className="flex items-center gap-2 mb-3">
                            <MessageSquare className="text-[#22C55E]" size={18} />
                            <span className="text-sm font-semibold text-[#22C55E]">Message:</span>
                          </div>
                          <div className="p-4 rounded-lg bg-[#0A0A0A]/60 border border-[#22C55E]/20">
                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                              {message.message}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;

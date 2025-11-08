import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Filter,
  Search,
  Download,
  DollarSign,
  Clock,
  Users,
  X,
  AlertCircle,
  Calendar,
  FileText,
  Image as ImageIcon,
  Menu,
  Home,
  Mail,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/auth-context";

const AdminDonations = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Get token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/payments/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStats(data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast.error("Failed to load statistics");
    }
  }, [API_URL]);

  // Fetch payments
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/payments`, {
        params: {
          status: filter === "all" ? undefined : filter,
          search: search || undefined,
          page,
          limit: 20,
        },
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setPayments(data.data);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Failed to fetch payments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, filter, search, page]);

  // Verify payment
  const handleVerify = async (id, notes = "") => {
    setActionLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/payments/${id}/verify`,
        { notes },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      toast.success("Payment verified successfully! 🎉");
      fetchPayments();
      fetchStats();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify payment");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  // Reject payment
  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason || reason.trim() === "") {
      toast.error("Rejection reason is required");
      return;
    }

    setActionLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/payments/${id}/reject`,
        { reason: reason.trim() },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      toast.success("Payment rejected");
      fetchPayments();
      fetchStats();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject payment");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete payment
  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this payment? This action cannot be undone."
      )
    )
      return;

    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}/api/payments/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Payment deleted successfully");
      fetchPayments();
      fetchStats();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete payment");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  // View payment details
  const viewPayment = async (id) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/payments/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSelectedPayment(data.data);
      setShowModal(true);
    } catch (error) {
      toast.error("Failed to load payment details");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#111827] text-white">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#0F1419] to-[#0B0E14] border-r border-emerald-500/20 z-50 shadow-2xl shadow-emerald-500/10"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-400 bg-clip-text text-transparent">
                  MGSA Admin
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-white hover:text-emerald-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => navigate("/admin")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-white hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
                >
                  <Home size={20} />
                  Dashboard Overview
                </button>
                <button
                  onClick={() => navigate("/admin/messages")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-white hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
                >
                  <Mail size={20} />
                  Messages
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <DollarSign size={20} />
                  Donations
                </button>
                <button
                  onClick={() => navigate("/admin?tab=settings")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-white hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
                >
                  <Settings size={20} />
                  Admin Management
                </button>
              </nav>
              <div className="absolute bottom-6 left-6 right-6">
                <button
                  onClick={() => logout?.()}
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

      {/* Main wrapper */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-sm border-b border-emerald-500/20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-white hover:text-emerald-400 transition-colors"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Donation Management
                  </h1>
                  <p className="text-sm text-gray-400">
                    View, verify, and manage all donation submissions
                  </p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">
                  {user?.fname} {user?.lname}
                </p>
                <p className="text-xs text-emerald-400">{user?.role}</p>
              </div>
            </div>
          </div>
          <div className="h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </header>

        {/* Page Content */}
        <div className="p-6">
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <StatCard
                icon={<DollarSign className="w-6 h-6" />}
                title="Total Donations"
                value={stats.total}
                color="from-blue-500 to-cyan-500"
                delay={0.1}
              />
              <StatCard
                icon={<Clock className="w-6 h-6" />}
                title="Pending"
                value={stats.totalPending}
                color="from-yellow-500 to-orange-500"
                delay={0.2}
              />
              <StatCard
                icon={<CheckCircle className="w-6 h-6" />}
                title="Verified"
                value={stats.totalVerified}
                color="from-green-500 to-emerald-500"
                delay={0.3}
              />
              <StatCard
                icon={<XCircle className="w-6 h-6" />}
                title="Rejected"
                value={stats.totalRejected}
                color="from-red-500 to-pink-500"
                delay={0.4}
              />
            </motion.div>
          )}

          {/* Filters & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6 shadow-[0_0_40px_rgba(0,255,255,0.1)]"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-3 flex-1">
                <Filter className="w-5 h-5 text-cyan-400" />
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setPage(1);
                  }}
                  className="flex-1 px-4 py-3 bg-[#0b1322]/60 border border-cyan-500/30 rounded-xl focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.3)] outline-none text-white transition"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Search */}
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-cyan-400" />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="flex-1 px-4 py-3 bg-[#0b1322]/60 border border-cyan-500/30 rounded-xl focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.3)] outline-none text-white placeholder-gray-400 transition"
                />
              </div>

              {/* Export Button */}
              <button
                onClick={() => toast.success("Export feature coming soon!")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl font-medium hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </motion.div>

          {/* Payments Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.1)]"
          >
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading donations...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No payments found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {filter !== "all"
                    ? `No ${filter} payments at the moment`
                    : "No donations have been submitted yet"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          Donor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {payments.map((payment, index) => (
                        <motion.tr
                          key={payment._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                {payment.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-white">
                                  {payment.fullName}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <p className="text-gray-300 truncate">
                              {payment.description}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-emerald-400 font-semibold">
                              {payment.amount > 0
                                ? `${payment.amount.toLocaleString()} ETB`
                                : "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={payment.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => viewPayment(payment._id)}
                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {payment.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleVerify(payment._id)}
                                    className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition"
                                    title="Verify"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleReject(payment._id)}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDelete(payment._id)}
                                className="p-2 text-gray-400 hover:bg-gray-500/10 rounded-lg transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t border-white/10 bg-white/5">
                    <div className="text-sm text-gray-400">
                      Showing {(page - 1) * pagination.limit + 1} to{" "}
                      {Math.min(page * pagination.limit, pagination.total)} of{" "}
                      {pagination.total} results
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Previous
                      </button>
                      <div className="flex items-center gap-2">
                        {Array.from(
                          { length: pagination.pages },
                          (_, i) => i + 1
                        )
                          .filter(
                            (p) =>
                              p === 1 ||
                              p === pagination.pages ||
                              Math.abs(p - page) <= 1
                          )
                          .map((p, i, arr) => (
                            <div key={p}>
                              {i > 0 && arr[i - 1] !== p - 1 && (
                                <span className="text-gray-500 px-2">...</span>
                              )}
                              <button
                                onClick={() => setPage(p)}
                                className={`px-4 py-2 rounded-lg transition ${
                                  page === p
                                    ? "bg-cyan-500 text-white"
                                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                                }`}
                              >
                                {p}
                              </button>
                            </div>
                          ))}
                      </div>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === pagination.pages}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Payment Detail Modal */}
          <AnimatePresence>
            {showModal && selectedPayment && (
              <PaymentModal
                payment={selectedPayment}
                onClose={() => setShowModal(false)}
                onVerify={handleVerify}
                onReject={handleReject}
                onDelete={handleDelete}
                actionLoading={actionLoading}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,255,255,0.1)] hover:shadow-[0_0_50px_rgba(0,255,255,0.2)] transition-all duration-300"
  >
    <div
      className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
    >
      {icon}
    </div>
    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-white">{value}</p>
  </motion.div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    pending: {
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
    },
    verified: {
      bg: "bg-green-500/20",
      text: "text-green-400",
      border: "border-green-500/30",
    },
    rejected: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/30",
    },
  };

  const style = styles[status] || styles.pending;

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full border ${style.bg} ${style.text} ${style.border}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Payment Modal Component
const PaymentModal = ({
  payment,
  onClose,
  onVerify,
  onReject,
  onDelete,
  actionLoading,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(0,255,255,0.3)]"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-start z-10">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-1">
              Payment Details
            </h2>
            <p className="text-gray-400 text-sm">
              ID: {payment._id.substring(0, 8)}...
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Donor Info */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">
                Donor Information
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <p className="text-lg text-white font-medium">
                  {payment.fullName}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">
                Payment Information
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Description</label>
                <p className="text-white mt-1">{payment.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Amount</label>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">
                    {payment.amount > 0
                      ? `${payment.amount.toLocaleString()} ETB`
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={payment.status} />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Submitted On
                </label>
                <p className="text-white mt-1">
                  {new Date(payment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Screenshot */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">
                Payment Screenshot
              </h3>
            </div>
            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
              <img
                src={payment.screenshotUrl}
                alt="Payment screenshot"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Verification Info */}
          {payment.status !== "pending" && (
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">
                {payment.status === "verified"
                  ? "Verification Details"
                  : "Rejection Details"}
              </h3>
              <div className="space-y-3">
                {payment.verifiedAt && (
                  <div>
                    <label className="text-sm text-gray-400">
                      {payment.status === "verified" ? "Verified" : "Rejected"}{" "}
                      At
                    </label>
                    <p className="text-white">
                      {new Date(payment.verifiedAt).toLocaleString()}
                    </p>
                  </div>
                )}
                {payment.rejectionReason && (
                  <div>
                    <label className="text-sm text-gray-400">Reason</label>
                    <p className="text-red-400 mt-1">
                      {payment.rejectionReason}
                    </p>
                  </div>
                )}
                {payment.notes && (
                  <div>
                    <label className="text-sm text-gray-400">Admin Notes</label>
                    <p className="text-white mt-1">{payment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 p-6 flex gap-3">
          {payment.status === "pending" && (
            <>
              <button
                onClick={() => onVerify(payment._id)}
                disabled={actionLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {actionLoading ? "Processing..." : "Verify Payment"}
              </button>
              <button
                onClick={() => onReject(payment._id)}
                disabled={actionLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-semibold hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                {actionLoading ? "Processing..." : "Reject Payment"}
              </button>
            </>
          )}
          <button
            onClick={() => onDelete(payment._id)}
            disabled={actionLoading}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDonations;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import {
//   DollarSign,
//   Trash2,
//   Eye,
//   Search,
//   Calendar,
//   User,
//   AlertCircle,
//   Menu,
//   X,
//   Home,
//   Settings,
//   LogOut,
//   Mail,
//   Image as ImageIcon,
//   XCircle,
// } from "lucide-react";
// import { useAuth } from "../context/auth-context";

// const AdminDonationsPage = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [donations, setDonations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedDonation, setSelectedDonation] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [donationToDelete, setDonationToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   useEffect(() => {
//     fetchDonations();
//   }, []);

//   const fetchDonations = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/payments`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setDonations(response.data.data || []);
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to fetch donations:", err);
//       setError("⚠️ Unable to load donations.");
//       setLoading(false);

//       if (err.response?.status === 401 || err.response?.status === 403) {
//         setTimeout(() => navigate("/login"), 2000);
//       }
//     }
//   };

//   const handleViewDetails = (donation) => {
//     setSelectedDonation(donation);
//     setShowModal(true);
//   };

//   const handleDeleteClick = (donation) => {
//     setDonationToDelete(donation);
//     setDeleteModalOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!donationToDelete) return;

//     const token = localStorage.getItem("token");
//     setDeleteLoading(true);

//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_API_URL}/api/payments/${donationToDelete._id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setDonations(donations.filter((d) => d._id !== donationToDelete._id));
//       setToastMessage("🗑️ Donation deleted successfully!");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       setDeleteModalOpen(false);
//       setDonationToDelete(null);
//       setDeleteLoading(false);
//     } catch (err) {
//       console.error("Delete error:", err);
//       setToastMessage("❌ Failed to delete donation.");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       setDeleteLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     setToastMessage("Logging out...");
//     setShowToast(true);
//     setTimeout(() => {
//       logout();
//       setShowToast(false);
//     }, 1000);
//   };

//   // Filter donations by search query
//   const filteredDonations = donations.filter((donation) =>
//     donation.fullName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
//       {/* Sidebar */}
//       <AnimatePresence>
//         {sidebarOpen && (
//           <motion.aside
//             initial={{ x: -300 }}
//             animate={{ x: 0 }}
//             exit={{ x: -300 }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#0F1419] to-[#0B0E14] border-r border-[#22C55E]/20 z-50 shadow-2xl shadow-[#22C55E]/10"
//           >
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-8">
//                 <h2 className="text-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#00FFC6] bg-clip-text text-transparent">
//                   MGSA Admin
//                 </h2>
//                 <button
//                   onClick={() => setSidebarOpen(false)}
//                   className="lg:hidden text-white hover:text-[#22C55E] transition-colors"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               <nav className="space-y-2">
//                 <button
//                   onClick={() => navigate("/admin/dashboard")}
//                   className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-white hover:bg-[#22C55E]/10 hover:text-[#22C55E] transition-all"
//                 >
//                   <Home size={20} />
//                   Dashboard Overview
//                 </button>
//                 <button
//                   onClick={() => navigate("/admin/messages")}
//                   className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-white hover:bg-[#22C55E]/10 hover:text-[#22C55E] transition-all"
//                 >
//                   <Mail size={20} />
//                   Messages
//                 </button>
//                 <button
//                   className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]"
//                 >
//                   <DollarSign size={20} />
//                   Donations
//                 </button>
//                 <button
//                   onClick={() => navigate("/admin/dashboard")}
//                   className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-white hover:bg-[#22C55E]/10 hover:text-[#22C55E] transition-all"
//                 >
//                   <Settings size={20} />
//                   Admin Management
//                 </button>
//               </nav>

//               <div className="absolute bottom-6 left-6 right-6">
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
//                 >
//                   <LogOut size={20} />
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </motion.aside>
//         )}
//       </AnimatePresence>

//       {/* Main Content */}
//       <div
//         className={`transition-all duration-300 ${
//           sidebarOpen ? "lg:ml-64" : "ml-0"
//         }`}
//       >
//         {/* Header */}
//         <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-[#22C55E]/20">
//           <div className="px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => setSidebarOpen(!sidebarOpen)}
//                   className="text-white hover:text-[#22C55E] transition-colors"
//                 >
//                   <Menu size={24} />
//                 </button>
//                 <div>
//                   <h1 className="text-2xl font-bold text-white">
//                     Donation Management
//                   </h1>
//                   <p className="text-sm text-gray-400">
//                     View and manage all donations
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="text-right">
//                   <p className="text-sm font-medium text-white">
//                     {user?.fname} {user?.lname}
//                   </p>
//                   <p className="text-xs text-[#22C55E]">{user?.role}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="h-[2px] bg-gradient-to-r from-transparent via-[#22C55E] to-transparent animate-pulse" />
//         </header>

//         {/* Main Content */}
//         <main className="p-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
//           >
//             {/* Search Bar */}
//             <div className="p-6 border-b border-white/10">
//               <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//                 <h2 className="text-xl font-bold text-white">
//                   All Donations ({filteredDonations.length})
//                 </h2>
//                 <div className="relative w-full md:w-96">
//                   <Search
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search by donor name..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-[#22C55E]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#22C55E] transition-colors"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Loading State */}
//             {loading && (
//               <div className="p-12 text-center">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   className="w-16 h-16 border-4 border-[#22C55E]/20 border-t-[#22C55E] rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-white font-semibold">Loading donations...</p>
//               </div>
//             )}

//             {/* Error State */}
//             {error && !loading && (
//               <div className="p-12 text-center">
//                 <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
//                 <p className="text-red-400 text-lg">{error}</p>
//               </div>
//             )}

//             {/* No Data State */}
//             {!loading && !error && filteredDonations.length === 0 && (
//               <div className="p-12 text-center">
//                 <DollarSign size={64} className="text-gray-500 mx-auto mb-4" />
//                 <h3 className="text-xl font-bold text-gray-400 mb-2">
//                   No donations found
//                 </h3>
//                 <p className="text-gray-500">
//                   {searchQuery
//                     ? "No donations match your search."
//                     : "No donations have been submitted yet."}
//                 </p>
//               </div>
//             )}

//             {/* Table */}
//             {!loading && !error && filteredDonations.length > 0 && (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-slate-800/50 border-b border-white/10">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
//                         Donor Name
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
//                         Amount (ETB)
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
//                         Description
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-white/5">
//                     {filteredDonations.map((donation, index) => (
//                       <motion.tr
//                         key={donation._id}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: index * 0.05 }}
//                         className="hover:bg-white/5 transition-colors"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-full flex items-center justify-center text-white font-bold">
//                               {donation.fullName.charAt(0).toUpperCase()}
//                             </div>
//                             <span className="text-sm font-medium text-white">
//                               {donation.fullName}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#22C55E] font-semibold">
//                           {donation.amount > 0
//                             ? donation.amount.toLocaleString()
//                             : "N/A"}
//                         </td>
//                         <td className="px-6 py-4 max-w-xs">
//                           <p className="text-sm text-gray-300 truncate">
//                             {donation.description}
//                           </p>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
//                           {new Date(donation.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                               donation.status === "verified"
//                                 ? "bg-green-500/20 text-green-400 border border-green-500/30"
//                                 : donation.status === "rejected"
//                                 ? "bg-red-500/20 text-red-400 border border-red-500/30"
//                                 : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
//                             }`}
//                           >
//                             {donation.status.charAt(0).toUpperCase() +
//                               donation.status.slice(1)}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => handleViewDetails(donation)}
//                               className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all"
//                               title="View Details"
//                             >
//                               <Eye size={18} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteClick(donation)}
//                               className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
//                               title="Delete"
//                             >
//                               <Trash2 size={18} />
//                             </button>
//                           </div>
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </motion.div>
//         </main>
//       </div>

//       {/* View Details Modal */}
//       <AnimatePresence>
//         {showModal && selectedDonation && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={() => setShowModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-gradient-to-br from-slate-800 to-slate-900 border border-[#22C55E]/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
//             >
//               {/* Modal Header */}
//               <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-start z-10">
//                 <div>
//                   <h2 className="text-2xl font-bold text-[#22C55E] mb-1">
//                     Donation Details
//                   </h2>
//                   <p className="text-gray-400 text-sm">
//                     ID: {selectedDonation._id.substring(0, 8)}...
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="p-2 hover:bg-white/10 rounded-lg transition"
//                 >
//                   <XCircle className="w-6 h-6 text-gray-400" />
//                 </button>
//               </div>

//               {/* Modal Content */}
//               <div className="p-6 space-y-6">
//                 {/* Donor Info */}
//                 <div className="bg-white/5 rounded-xl p-5 border border-white/10">
//                   <div className="flex items-center gap-3 mb-4">
//                     <User className="w-5 h-5 text-[#22C55E]" />
//                     <h3 className="text-lg font-semibold text-white">
//                       Donor Information
//                     </h3>
//                   </div>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm text-gray-400">Full Name</label>
//                       <p className="text-lg text-white font-medium">
//                         {selectedDonation.fullName}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-400">Description</label>
//                       <p className="text-white mt-1">
//                         {selectedDonation.description}
//                       </p>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="text-sm text-gray-400">Amount</label>
//                         <p className="text-2xl font-bold text-[#22C55E] mt-1">
//                           {selectedDonation.amount > 0
//                             ? `${selectedDonation.amount.toLocaleString()} ETB`
//                             : "Not specified"}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="text-sm text-gray-400">Status</label>
//                         <div className="mt-1">
//                           <span
//                             className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                               selectedDonation.status === "verified"
//                                 ? "bg-green-500/20 text-green-400 border border-green-500/30"
//                                 : selectedDonation.status === "rejected"
//                                 ? "bg-red-500/20 text-red-400 border border-red-500/30"
//                                 : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
//                             }`}
//                           >
//                             {selectedDonation.status.charAt(0).toUpperCase() +
//                               selectedDonation.status.slice(1)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-400 flex items-center gap-2">
//                         <Calendar className="w-4 h-4" />
//                         Submitted On
//                       </label>
//                       <p className="text-white mt-1">
//                         {new Date(selectedDonation.createdAt).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Screenshot */}
//                 <div className="bg-white/5 rounded-xl p-5 border border-white/10">
//                   <div className="flex items-center gap-3 mb-4">
//                     <ImageIcon className="w-5 h-5 text-[#22C55E]" />
//                     <h3 className="text-lg font-semibold text-white">
//                       Payment Screenshot
//                     </h3>
//                   </div>
//                   <div className="bg-black/30 rounded-xl p-4 border border-white/10">
//                     <img
//                       src={selectedDonation.screenshotUrl}
//                       alt="Payment screenshot"
//                       className="w-full rounded-lg shadow-lg"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Delete Confirmation Modal */}
//       <AnimatePresence>
//         {deleteModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={() => !deleteLoading && setDeleteModalOpen(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
//             >
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Trash2 className="w-8 h-8 text-red-500" />
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">
//                   Delete Donation?
//                 </h3>
//                 <p className="text-gray-400 mb-6">
//                   This will permanently delete the donation record and screenshot
//                   from Cloudinary. This action cannot be undone.
//                 </p>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setDeleteModalOpen(false)}
//                     disabled={deleteLoading}
//                     className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all disabled:opacity-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleDeleteConfirm}
//                     disabled={deleteLoading}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50"
//                   >
//                     {deleteLoading ? "Deleting..." : "Delete"}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Toast Notification */}
//       <AnimatePresence>
//         {showToast && (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 50 }}
//             className="fixed bottom-6 right-6 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white px-6 py-3 rounded-lg shadow-lg z-50"
//           >
//             {toastMessage}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminDonationsPage;

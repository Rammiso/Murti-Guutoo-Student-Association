/**
 * EXAMPLE: Admin Donations Dashboard Component
 * 
 * This is a reference implementation showing how to integrate
 * the donation system into your admin dashboard.
 * 
 * Copy and adapt this to your admin panel structure.
 */

import { useState, useEffect } from "react";
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
} from "lucide-react";

const AdminDonations = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Get token from localStorage or your auth context
  const getToken = () => localStorage.getItem("token");

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/payments/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStats(data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Fetch payments
  const fetchPayments = async () => {
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
  };

  // Verify payment
  const handleVerify = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/payments/${id}/verify`,
        { notes: "Verified by admin" },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      toast.success("Payment verified successfully!");
      fetchPayments();
      fetchStats();
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to verify payment");
      console.error(error);
    }
  };

  // Reject payment
  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await axios.put(
        `${API_URL}/api/payments/${id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      toast.success("Payment rejected");
      fetchPayments();
      fetchStats();
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to reject payment");
      console.error(error);
    }
  };

  // Delete payment
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    try {
      await axios.delete(`${API_URL}/api/payments/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Payment deleted");
      fetchPayments();
      fetchStats();
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to delete payment");
      console.error(error);
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
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [filter, search, page]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Donation Management</h1>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Donations"
            value={stats.total}
            color="blue"
          />
          <StatCard
            title="Pending"
            value={stats.totalPending}
            color="yellow"
          />
          <StatCard
            title="Verified"
            value={stats.totalVerified}
            color="green"
          />
          <StatCard
            title="Rejected"
            value={stats.totalRejected}
            color="red"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No payments found
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.fullName}
                    </td>
                    <td className="px-6 py-4">
                      {payment.description.substring(0, 50)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.amount > 0 ? `$${payment.amount}` : "Any"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewPayment(payment._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {payment.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleVerify(payment._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(payment._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(payment._id)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination && (
              <div className="px-6 py-4 flex items-center justify-between border-t">
                <div className="text-sm text-gray-500">
                  Showing {(page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.pages}
                    className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Payment Detail Modal */}
      {showModal && selectedPayment && (
        <PaymentModal
          payment={selectedPayment}
          onClose={() => setShowModal(false)}
          onVerify={handleVerify}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    red: "bg-red-500",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`w-12 h-12 ${colors[color]} rounded-lg mb-4`} />
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    verified: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PaymentModal = ({ payment, onClose, onVerify, onReject, onDelete }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">Payment Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Full Name
              </label>
              <p className="text-lg">{payment.fullName}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Description
              </label>
              <p className="text-lg">{payment.description}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Amount
              </label>
              <p className="text-lg">
                {payment.amount > 0 ? `$${payment.amount}` : "Any Amount"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <div className="mt-1">
                <StatusBadge status={payment.status} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Screenshot
              </label>
              <img
                src={payment.screenshotUrl}
                alt="Payment screenshot"
                className="mt-2 rounded-lg border max-w-full"
              />
            </div>

            {payment.rejectionReason && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Rejection Reason
                </label>
                <p className="text-lg text-red-600">
                  {payment.rejectionReason}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-500">
                Submitted
              </label>
              <p className="text-lg">
                {new Date(payment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            {payment.status === "pending" && (
              <>
                <button
                  onClick={() => onVerify(payment._id)}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Verify
                </button>
                <button
                  onClick={() => onReject(payment._id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => onDelete(payment._id)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDonations;

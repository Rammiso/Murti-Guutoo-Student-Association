import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Users,
  MapPin,
  BookOpen,
  GraduationCap,
  Search,
  Download,
  LogOut,
  Home,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  UserCog,
  Shield,
  ShieldOff,
  Mail,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/auth-context";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterZone, setFilterZone] = useState("");
  const [filterWoreda, setFilterWoreda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard or settings
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const itemsPerPage = 5;

  // Check if current user is main admin
  const isMainAdmin = user?.mainAdmin === true;
  
  // Debug: Log main admin status
  useEffect(() => {
    if (user) {
      console.log("👤 Current User:", {
        email: user.email,
        role: user.role,
        mainAdmin: user.mainAdmin,
        isMainAdmin: isMainAdmin
      });
    }
  }, [user, isMainAdmin]);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      // Redirect if no token
      if (!token) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      // Access control - redirect if not admin
      if (!user || user.role !== "admin") {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Map backend response to frontend format
        const mappedUsers = response.data.map((u) => ({
          id: u._id,
          studentId: u.studentId || "N/A",
          firstName: u.fname || "N/A",
          lastName: u.lname || "",
          middleName: u.mname || "",
          email: u.email,
          phone: u.phone || "N/A",
          zone: u.zone || "N/A",
          woreda: u.woreda || "N/A",
          college: u.college || "N/A",
          department: u.department || "N/A",
          year: u.year || "N/A",
          gender: u.gender || "N/A",
          role: u.role || "student",
        }));

        setStudents(mappedUsers);
        console.log(`✅ Fetched ${mappedUsers.length} users from backend`);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
        setError("Unable to load student records. Please try again.");
        setLoading(false);

        // Handle 401/403 - redirect to login
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.clear();
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      }
    };

    fetchUsers();
  }, [user, navigate]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const westHararghe = students.filter(
      (s) => s.zone === "West Hararghe"
    ).length;
    const eastHararghe = students.filter(
      (s) => s.zone === "East Hararghe"
    ).length;
    const departments = new Set(
      students.map((s) => s.department).filter((d) => d && d !== "N/A")
    ).size;
    const colleges = new Set(
      students.map((s) => s.college).filter((c) => c && c !== "N/A")
    ).size;

    return {
      totalStudents,
      westHararghe,
      eastHararghe,
      departments,
      colleges,
    };
  }, [students]);

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        tableSearchQuery === "" ||
        student.firstName.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        student.department.toLowerCase().includes(tableSearchQuery.toLowerCase());

      const matchesYear = filterYear === "" || student.year === filterYear;
      const matchesZone = filterZone === "" || student.zone === filterZone;
      const matchesWoreda =
        filterWoreda === "" || student.woreda === filterWoreda;

      return matchesSearch && matchesYear && matchesZone && matchesWoreda;
    });
  }, [tableSearchQuery, filterYear, filterZone, filterWoreda, students]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [tableSearchQuery, filterYear, filterZone, filterWoreda]);

  // Get unique values for filters
  const years = [...new Set(students.map((s) => s.year))].sort();
  const zones = [...new Set(students.map((s) => s.zone))].sort();
  const woredas = useMemo(() => {
    if (filterZone) {
      return [
        ...new Set(
          students.filter((s) => s.zone === filterZone).map((s) => s.woreda)
        ),
      ].sort();
    }
    return [...new Set(students.map((s) => s.woreda))].sort();
  }, [filterZone]);

  // Search user by email or phone
  const handleSearchUser = async () => {
    if (!searchQuery.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");
      setSearchedUser(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/users/search`,
        {
          params: { query: searchQuery.trim() },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setSearchedUser(response.data);
        console.log("✅ User found:", response.data.email);
      }
      setSearchLoading(false);
    } catch (err) {
      console.error("❌ Search error:", err);
      setSearchLoading(false);

      if (err.response?.status === 404) {
        setSearchError("No user found. Please check email or phone.");
      } else if (err.response?.status === 403) {
        setSearchError("Unauthorized. Admin access required.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setSearchError("Failed to search user. Please try again.");
      }
    }
  };

  // Update user role
  const handleRoleUpdate = async (userId, newRole) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setRoleUpdateLoading(true);

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success toast
      const message =
        newRole === "admin"
          ? "User promoted to admin!"
          : "Admin rights removed.";
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Refresh user info
      await handleSearchUser();

      setRoleUpdateLoading(false);
      console.log(`✅ Role updated to ${newRole}`);
    } catch (err) {
      console.error("❌ Role update error:", err);
      console.error("Error details:", {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data
      });
      setRoleUpdateLoading(false);

      const errorMsg =
        err.response?.data?.message || "Failed to update role. Please try again.";
      setToastMessage(errorMsg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      if (err.response?.status === 403) {
        setTimeout(() => navigate("/login"), 2000);
      }
    }
  };

  // Delete student handler
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setDeleteLoading(true);

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/users/${studentToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove student from state with animation
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));

      // Show success toast
      setToastMessage("✅ Student deleted successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Close modal
      setDeleteModalOpen(false);
      setStudentToDelete(null);
      setDeleteLoading(false);

      console.log(`✅ Student deleted: ${studentToDelete.email}`);
    } catch (err) {
      console.error("❌ Delete error:", err);
      setDeleteLoading(false);

      const errorMsg =
        err.response?.data?.message || "Failed to delete student. Please try again.";
      setToastMessage(`❌ ${errorMsg}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setTimeout(() => navigate("/login"), 2000);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  // Export to Excel function
  const handleExport = () => {
    if (!filteredStudents || filteredStudents.length === 0) {
      setToastMessage("No data to export");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      // Clean data - use the mapped field names (firstName, lastName, etc.)
      const cleanData = filteredStudents.map((student) => ({
        "Student ID": student.studentId || "",
        Email: student.email,
        "First Name": student.firstName,
        "Last Name": student.lastName || "",
        "Middle Name": student.middleName || "",
        Phone: student.phone || "",
        Gender: student.gender || "",
        Zone: student.zone,
        Woreda: student.woreda || "",
        Year: student.year || "",
        College: student.college || "",
        Department: student.department || ""
      }));

      // Create a worksheet from the cleaned data
      const worksheet = XLSX.utils.json_to_sheet(cleanData);

      // Set column widths for better readability
      const columnWidths = [
        { wch: 20 }, // Student ID
        { wch: 30 }, // Email
        { wch: 15 }, // First Name
        { wch: 15 }, // Last Name
        { wch: 15 }, // Middle Name
        { wch: 15 }, // Phone
        { wch: 10 }, // Gender
        { wch: 20 }, // Zone
        { wch: 15 }, // Woreda
        { wch: 10 }, // Year
        { wch: 20 }, // College
        { wch: 25 }  // Department
      ];
      worksheet['!cols'] = columnWidths;

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "MGSA_Students_Data.xlsx");

      // Show success toast
      setToastMessage("✅ Excel file exported successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Export error:", error);
      setToastMessage("❌ Failed to export data. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setToastMessage("Logging out...");
    setShowToast(true);
    setTimeout(() => {
      logout();
      setShowToast(false);
    }, 1000);
  };

  // Stat cards data
  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      gradient: "from-[#22C55E] to-[#16A34A]",
    },
    {
      title: "Students by Zone",
      value: `W: ${stats.westHararghe} / E: ${stats.eastHararghe}`,
      icon: MapPin,
      gradient: "from-[#00FFC6] to-[#22C55E]",
    },
    {
      title: "Total Departments",
      value: stats.departments,
      icon: BookOpen,
      gradient: "from-[#22C55E] to-[#00FFC6]",
    },
    {
      title: "Total Colleges",
      value: stats.colleges,
      icon: GraduationCap,
      gradient: "from-[#16A34A] to-[#22C55E]",
    },
  ];

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
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === "dashboard"
                      ? "bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]"
                      : "text-[#E0E0E0] hover:bg-[#22C55E]/10 hover:text-[#22C55E]"
                  }`}
                >
                  <Home size={20} />
                  Dashboard Overview
                </button>
                <button
                  onClick={() => navigate("/admin/messages")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[#E0E0E0] hover:bg-[#22C55E]/10 hover:text-[#22C55E] transition-all"
                >
                  <Mail size={20} />
                  Messages
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === "settings"
                      ? "bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]"
                      : "text-[#E0E0E0] hover:bg-[#22C55E]/10 hover:text-[#22C55E]"
                  }`}
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
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-400">
                    Murti Guuto Students Association
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#E0E0E0]">
                    {user?.fname} {user?.lname}
                  </p>
                  <p className="text-xs text-[#22C55E]">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#22C55E] to-transparent animate-pulse" />
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {activeTab === "dashboard" && (
            <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl from-[#22C55E]/30 to-[#00FFC6]/30" />
                <div className="relative bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] p-6 rounded-xl border border-[#22C55E]/30 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${card.gradient} shadow-lg`}
                    >
                      <card.icon size={24} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm text-gray-400 mb-1">{card.title}</h3>
                  <p className="text-2xl font-bold text-[#E0E0E0]">
                    {card.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Student Records Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] rounded-xl border border-[#22C55E]/30 shadow-2xl overflow-hidden"
          >
            {/* Table Header */}
            <div className="p-6 border-b border-[#22C55E]/20">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold text-[#E0E0E0]">
                  Student Records
                </h2>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-lg hover:shadow-lg hover:shadow-[#22C55E]/50 transition-all"
                >
                  <Download size={18} />
                  Export to Excel
                </button>
              </div>

              {/* Search and Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by name, email, or department..."
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#0B0E14] border border-[#22C55E]/30 rounded-lg text-[#E0E0E0] placeholder-gray-500 focus:outline-none focus:border-[#22C55E] transition-colors"
                  />
                </div>

                {/* Year Filter */}
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="px-4 py-2 bg-[#0B0E14] border border-[#22C55E]/30 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#22C55E] transition-colors"
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                {/* Zone Filter */}
                <select
                  value={filterZone}
                  onChange={(e) => {
                    setFilterZone(e.target.value);
                    setFilterWoreda("");
                  }}
                  className="px-4 py-2 bg-[#0B0E14] border border-[#22C55E]/30 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#22C55E] transition-colors"
                >
                  <option value="">All Zones</option>
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>

                {/* Woreda Filter */}
                <select
                  value={filterWoreda}
                  onChange={(e) => setFilterWoreda(e.target.value)}
                  className="px-4 py-2 bg-[#0B0E14] border border-[#22C55E]/30 rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#22C55E] transition-colors"
                  disabled={!filterZone}
                >
                  <option value="">All Woredas</option>
                  {woredas.map((woreda) => (
                    <option key={woreda} value={woreda}>
                      {woreda}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-sm text-gray-400 mt-4">
                Showing {paginatedStudents.length} of {filteredStudents.length}{" "}
                students
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto relative">
              {/* Loading State */}
              {loading && (
                <div className="absolute inset-0 bg-[#0B0E14]/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-[#22C55E]/20 border-t-[#22C55E] rounded-full mx-auto mb-4"
                    />
                    <p className="text-[#E0E0E0] font-semibold">Loading student records...</p>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="mt-4 h-1 w-48 bg-gradient-to-r from-[#22C55E] to-[#00FFC6] rounded-full mx-auto"
                    />
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="p-12 text-center">
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
                  <h3 className="text-xl font-bold text-red-400 mb-2">Error</h3>
                  <p className="text-gray-400 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#22C55E]/50 transition-all"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* No Data State */}
              {!loading && !error && students.length === 0 && (
                <div className="p-12 text-center">
                  <Users size={64} className="text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No student records found</h3>
                  <p className="text-gray-500">There are no registered students in the system yet.</p>
                </div>
              )}

              {/* Table Content */}
              {!loading && !error && students.length > 0 && (
                <table className="w-full">
                  <thead className="bg-[#0B0E14] border-b border-[#22C55E]/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Phone size={14} />
                          Phone
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
                        Zone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
                        Woreda
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
                        College
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#22C55E]/10">
                    {paginatedStudents.map((student, index) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`${
                          index % 2 === 0 ? "bg-[#0f1419]" : "bg-[#1a1f2e]"
                        } hover:bg-[#22C55E]/10 transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[#22C55E]">
                          {student.studentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#E0E0E0]">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {student.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {student.zone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {student.woreda}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                          {student.college}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {student.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {student.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              student.role === "admin"
                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                : "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30"
                            }`}
                          >
                            {student.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDeleteClick(student)}
                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(232,97,125,0.3)] transition-all duration-300 group"
                            title="Delete student"
                          >
                            <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-[#22C55E]/20 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-[#0B0E14] border border-[#22C55E]/30 rounded-lg text-[#E0E0E0] hover:bg-[#22C55E]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        currentPage === page
                          ? "bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white"
                          : "bg-[#0B0E14] border border-[#22C55E]/30 text-[#E0E0E0] hover:bg-[#22C55E]/10"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-[#0B0E14] border border-[#22C55E]/30 rounded-lg text-[#E0E0E0] hover:bg-[#22C55E]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
            </>
          )}

          {/* Admin Management Section */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] rounded-xl border border-[#22C55E]/30 shadow-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <UserCog size={28} className="text-[#22C55E]" />
                  <h2 className="text-2xl font-bold text-[#E0E0E0]">
                    Admin Management
                  </h2>
                </div>
                <p className="text-gray-400 text-sm">
                  Search for users and manage admin roles
                  {!isMainAdmin && (
                    <span className="ml-2 text-yellow-400">
                      (View only - Main admin access required)
                    </span>
                  )}
                </p>
              </div>

              {/* Search Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] rounded-xl border-2 border-[#22C55E]/30 shadow-2xl shadow-[#22C55E]/10 p-6"
              >
                <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4">
                  Search User
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-2">
                      Search by email or phone number
                    </label>
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Enter email or phone number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSearchUser();
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-[#0B0E14] border-2 border-[#22C55E]/30 rounded-lg text-[#E0E0E0] placeholder-gray-500 focus:outline-none focus:border-[#22C55E] transition-all"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSearchUser}
                    disabled={searchLoading || !searchQuery.trim()}
                    className="md:mt-7 px-6 py-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#22C55E]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {searchLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        Search
                      </>
                    )}
                  </button>
                </div>

                {/* Search Error */}
                {searchError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <p className="text-red-400 text-sm">{searchError}</p>
                  </motion.div>
                )}
              </motion.div>

              {/* User Info Card */}
              {searchedUser && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] rounded-xl border-2 border-[#22C55E]/40 shadow-2xl shadow-[#22C55E]/20 p-6 overflow-hidden"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/5 to-[#00FFC6]/5 pointer-events-none" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-[#E0E0E0] mb-1">
                          {searchedUser.fname} {searchedUser.lname}
                        </h3>
                        <p className="text-[#22C55E] text-sm">{searchedUser.email}</p>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          searchedUser.role === "admin"
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/40"
                            : "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40"
                        }`}
                      >
                        {searchedUser.role === "admin" ? "Admin" : "Student"}
                      </motion.div>
                    </div>

                    {/* User Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-[#0B0E14]/50 rounded-lg border border-[#22C55E]/20">
                        <p className="text-xs text-gray-400 mb-1">Phone</p>
                        <p className="text-sm text-[#E0E0E0] font-medium">
                          {searchedUser.phone || "N/A"}
                        </p>
                      </div>
                      <div className="p-4 bg-[#0B0E14]/50 rounded-lg border border-[#22C55E]/20">
                        <p className="text-xs text-gray-400 mb-1">Zone</p>
                        <p className="text-sm text-[#E0E0E0] font-medium">
                          {searchedUser.zone || "N/A"}
                        </p>
                      </div>
                      <div className="p-4 bg-[#0B0E14]/50 rounded-lg border border-[#22C55E]/20">
                        <p className="text-xs text-gray-400 mb-1">College</p>
                        <p className="text-sm text-[#E0E0E0] font-medium">
                          {searchedUser.college || "N/A"}
                        </p>
                      </div>
                      <div className="p-4 bg-[#0B0E14]/50 rounded-lg border border-[#22C55E]/20">
                        <p className="text-xs text-gray-400 mb-1">Department</p>
                        <p className="text-sm text-[#E0E0E0] font-medium">
                          {searchedUser.department || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {searchedUser.role === "student" ? (
                        <motion.button
                          whileHover={isMainAdmin ? { scale: 1.02 } : {}}
                          whileTap={isMainAdmin ? { scale: 0.98 } : {}}
                          onClick={() => handleRoleUpdate(searchedUser._id, "admin")}
                          disabled={!isMainAdmin || roleUpdateLoading}
                          className="relative flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                          title={!isMainAdmin ? "Only main admin can modify roles" : ""}
                        >
                          {roleUpdateLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                          ) : (
                            <>
                              <Shield size={18} />
                              Promote to Admin
                            </>
                          )}
                          {!isMainAdmin && (
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Only main admin can modify roles
                            </span>
                          )}
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={isMainAdmin ? { scale: 1.02 } : {}}
                          whileTap={isMainAdmin ? { scale: 0.98 } : {}}
                          onClick={() => handleRoleUpdate(searchedUser._id, "student")}
                          disabled={!isMainAdmin || roleUpdateLoading}
                          className="relative flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                          title={!isMainAdmin ? "Only main admin can modify roles" : ""}
                        >
                          {roleUpdateLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                          ) : (
                            <>
                              <ShieldOff size={18} />
                              Remove Admin Rights
                            </>
                          )}
                          {!isMainAdmin && (
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Only main admin can modify roles
                            </span>
                          )}
                        </motion.button>
                      )}
                      <button
                        onClick={() => {
                          setSearchedUser(null);
                          setSearchQuery("");
                          setSearchError("");
                        }}
                        className="px-6 py-3 bg-[#0B0E14] border border-[#22C55E]/30 text-[#E0E0E0] font-semibold rounded-lg hover:bg-[#22C55E]/10 transition-all"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && studentToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleDeleteCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border-2 border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-red-500/20"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500/30">
                  <Trash2 className="text-red-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Delete Student?
                </h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="text-[#22C55E] font-semibold">
                    {studentToDelete.firstName} {studentToDelete.lastName}
                  </span>
                  ? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteCancel}
                    disabled={deleteLoading}
                    className="flex-1 px-6 py-3 bg-[#0B0E14] border border-[#22C55E]/30 text-[#E0E0E0] font-semibold rounded-lg hover:bg-[#22C55E]/10 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deleteLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <Trash2 size={18} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 px-6 py-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-lg shadow-2xl shadow-[#22C55E]/50 z-50"
          >
            <p className="font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;

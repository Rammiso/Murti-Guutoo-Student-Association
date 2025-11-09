import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  uploadResource,
  getResources,
  downloadResource,
} from "../api/resourceService";
import { useAuth } from "../context/auth-context";
import BG_LOCAL from "../assets/photo_2025-10-28_16-54-40.jpg";

const COURSE_CATEGORIES = [
  "Mathematics",
  "Logic",
  "Physics",
  "English",
  "Geography",
  "Psychology",
  "Economics",
  "CoC",
];

const KNOWN_CATEGORIES = COURSE_CATEGORIES;

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB in bytes

const formatFromPath = (path) => (path?.split(".").pop() || "").toLowerCase();

const titleFromPath = (path) => {
  const last = path?.split("/").pop() || path;
  const base = last.replace(/\.[^.]+$/, "");
  return base.replace(/[-_]+/g, " ");
};

const FormatIcon = ({ ext }) => {
  const common = "w-5 h-5";
  if (ext === "pdf")
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${common} text-red-500`}
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 2 6 6h-6Z" />
      </svg>
    );
  if (ext === "doc" || ext === "docx")
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${common} text-blue-600`}
      >
        <path d="M4 4h16v16H4Zm3 5h2l1 6h-2l-.5-3.5L7 15H5l1-6Zm6 0h2v6h-2Zm4 0h2v6h-2Z" />
      </svg>
    );
  if (ext === "ppt" || ext === "pptx")
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${common} text-orange-500`}
      >
        <path d="M3 4h18v16H3Zm8 3h7v10h-7ZM6 7h3v10H6Z" />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${common} text-gray-500`}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 2 6 6h-6Z" />
    </svg>
  );
};

const Resources = () => {
  const { user } = useAuth();
  const [active, setActive] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    category: "",
    file: null,
  });
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloading, setDownloading] = useState(null); // Track which file is downloading

  // Fetch resources on mount from backend API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const result = await getResources();

        if (result.success) {
          // Map backend format to component format
          const mappedResources = result.resources.map((r) => ({
            id: r.id,
            title: r.title,
            category: r.course, // Map 'course' to 'category'
            file: r.fileName,
            size: (r.fileSize / (1024 * 1024)).toFixed(2) + " MB",
            uploadDate: new Date(r.uploadedAt).toLocaleDateString(),
          }));
          setResources(mappedResources);
          console.log("Resources loaded:", mappedResources.length);
        } else {
          showToast("Failed to load resources", "error");
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        showToast("Error loading resources", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Toast notification helper
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Show all known categories immediately, don't wait for resources to load
  const categories = KNOWN_CATEGORIES;

  const filtered = useMemo(() => {
    if (!active) return [];
    return resources.filter((r) => r.category === active);
  }, [active, resources]);

  const handleDownload = async (resourceId, filename) => {
    if (!user) {
      showToast("Please login to download", "error");
      return;
    }

    try {
      setDownloading(resourceId); // Set downloading state
      showToast("Preparing download...", "info");

      const result = await downloadResource(resourceId, filename);

      if (result.success) {
        showToast("Download started successfully!", "success");
      } else {
        showToast(result.message || "Download failed", "error");
      }
    } catch (error) {
      console.error("Download error:", error);
      showToast("Download failed. Please try again.", "error");
    } finally {
      setDownloading(null); // Clear downloading state
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(
        `File size exceeds 30MB limit. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB`
      );
      e.target.value = ""; // Reset input
      return;
    }

    // Validate file type
    const allowedTypes = [
      ".pdf",
      ".docx",
      ".pptx",
      ".ppt",
      ".zip",
      ".doc",
      ".png",
      ".jpg",
      ".jpeg",
    ];
    const fileExt = "." + file.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      setUploadError(
        "Invalid file type. Only PDF, DOCX, PPTX, PPT, and ZIP files are allowed."
      );
      e.target.value = "";
      return;
    }

    setUploadError("");
    setUploadForm((prev) => ({ ...prev, file }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadError("");

    // Validation
    if (!uploadForm.category) {
      setUploadError("Please select a course category");
      return;
    }
    if (!uploadForm.file) {
      setUploadError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Prepare FormData for upload
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("title", uploadForm.file.name.replace(/\.[^.]+$/, ""));
      formData.append("course", uploadForm.category);
      formData.append("department", "General"); // Can be made dynamic
      formData.append("description", `Uploaded by ${user?.email || "user"}`);

      // Call resourceService upload function with progress callback
      const result = await uploadResource(formData, (progress) => {
        setUploadProgress(progress);
      });

      if (result.success) {
        // Complete progress
        setUploadProgress(100);

        // Add to resources list
        const newResource = {
          id: result.resource.id,
          title: result.resource.title,
          category: result.resource.course,
          file: result.resource.fileName,
          size: (result.resource.fileSize / (1024 * 1024)).toFixed(2) + " MB",
          uploadDate: new Date(result.resource.uploadedAt).toLocaleDateString(),
        };

        setResources((prev) => [newResource, ...prev]);

        // Show success toast
        showToast("File uploaded successfully!", "success");
        console.log("Upload successful:", result.resource);

        // Reset form
        setUploadForm({ category: "", file: null });
        document.getElementById("file-input").value = "";

        // Reset upload state after brief delay
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 1000);
      } else {
        setUploadError(result.message || "Upload failed");
        showToast(result.message || "Upload failed", "error");
        setUploading(false);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Upload failed. Please try again.");
      showToast("Upload failed. Please try again.", "error");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden text-black">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <div
              className={`rounded-lg shadow-lg p-4 flex items-center gap-3 ${
                toast.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {toast.type === "success" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
                </svg>
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 blur-md"
        style={{ backgroundImage: `url(${BG_LOCAL})` }}
        aria-hidden="true"
      />
      {/* Soft readability overlay */}
      <div className="absolute inset-0 bg-white/70" aria-hidden="true" />
      {/* Particle overlay */}
      <div className="particles" aria-hidden="true">
        <div
          className="particle sm"
          style={{
            top: "14%",
            left: "8%",
            animationDelay: "0s",
            animationDuration: "15s",
          }}
        />
        <div
          className="particle accent"
          style={{
            top: "28%",
            left: "22%",
            animationDelay: "2s",
            animationDuration: "16s",
          }}
        />
        <div
          className="particle"
          style={{
            top: "46%",
            left: "12%",
            animationDelay: "1s",
            animationDuration: "14s",
          }}
        />
        <div
          className="particle sm"
          style={{
            top: "18%",
            left: "86%",
            animationDelay: "1.2s",
            animationDuration: "15s",
          }}
        />
        <div
          className="particle lg accent"
          style={{
            top: "64%",
            left: "72%",
            animationDelay: "2.4s",
            animationDuration: "17s",
          }}
        />
        <div
          className="particle"
          style={{
            top: "78%",
            left: "18%",
            animationDelay: "0.5s",
            animationDuration: "16s",
          }}
        />
      </div>
      <div className="relative z-10 w-full max-w-none px-0 md:px-4 py-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-black">
            Freshman Course Resources
          </h2>
          <span className="mt-2 inline-block border-b-4 border-mgsa-accent w-24" />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.05 }}
          className="mt-8 px-4 md:px-0"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3 max-w-5xl mx-auto">
            {categories.map((c) => {
              const activeBtn = c === active;
              return (
                <motion.button
                  key={c}
                  onClick={() => setActive(c)}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.03 }}
                  className={`px-3 py-2 rounded-full border text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap ${
                    activeBtn
                      ? "border-mgsa-accent bg-mgsa-accent text-white shadow"
                      : "border-mgsa-accent text-mgsa-accent hover:bg-mgsa-accent hover:text-white"
                  }`}
                >
                  {c}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 px-4 md:px-0"
          >
            {filtered.map((item, idx) => {
              const ext = formatFromPath(item.file);
              const title = item.title || titleFromPath(item.file);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    delay: Math.min(idx * 0.03, 0.2),
                  }}
                  className="relative bg-white rounded-2xl border border-mgsa-border shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 rounded-lg bg-gray-50 p-2 ring-1 ring-gray-100">
                        <FormatIcon ext={ext} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3
                          className="font-semibold text-black truncate"
                          title={title}
                        >
                          {title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded-full bg-mgsa-badgeBg text-mgsa-badgeText ring-1 ring-transparent">
                            {item.category}
                          </span>
                          {/* <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 ring-1 ring-gray-100 uppercase">
                            {ext || "file"}
                          </span> */}
                          {item.size && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                              📦 {item.size}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <motion.button
                        whileHover={{
                          scale: downloading === item.id ? 1 : 1.03,
                        }}
                        whileTap={{ scale: downloading === item.id ? 1 : 0.98 }}
                        onClick={() =>
                          handleDownload(item.id, item.file || item.title)
                        }
                        disabled={downloading === item.id}
                        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-white transition-all duration-300 ${
                          downloading === item.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-mgsa-accent hover:bg-mgsa-accentDark hover:scale-105"
                        }`}
                      >
                        {downloading === item.id ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4"
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
                            Downloading...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path d="M12 3v10.586l3.293-3.293 1.414 1.414L12 17.414l-4.707-4.707 1.414-1.414L11 13.586V3h2ZM5 19h14v2H5Z" />
                            </svg>
                            Download
                          </>
                        )}
                      </motion.button>
                      {!user && (
                        <p className="mt-1 text-xs text-gray-500 text-center">
                          Login required to download
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Loading state - Only show when category is selected */}
        {loading && active && (
          <div className="mt-14 grid place-items-center text-center text-gray-600">
            <div className="w-14 h-14 rounded-2xl bg-white shadow ring-1 ring-gray-100 grid place-items-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-mgsa-accent rounded-full animate-spin" />
            </div>
            <p className="mt-3">Loading resources...</p>
          </div>
        )}

        {/* Empty state - No category selected - Show immediately, minimized */}
        {!active && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-8 max-w-xl mx-auto px-4"
          >
            <div className="relative overflow-hidden rounded-2xl border border-mgsa-accent/30 bg-gradient-to-br from-white/95 to-mgsa-accent/5 backdrop-blur-sm shadow-lg p-6">
              {/* Minimized background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-mgsa-accent/8 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 text-center space-y-3">
                {/* Compact Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-mgsa-accent to-mgsa-accentDark shadow-md shadow-mgsa-accent/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                  </svg>
                </div>

                {/* Compact Title */}
                <h3 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mgsa-accent to-mgsa-accentDark">
                  Select a Course Category
                </h3>

                {/* Compact Description */}
                <p className="text-gray-600 text-sm leading-snug max-w-sm mx-auto">
                  Choose a course above to explore study materials and resources
                </p>

                {/* Compact arrow */}
                <motion.div
                  animate={{ y: [-3, 3, -3] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-mgsa-accent inline-block"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 4l-8 8h5v8h6v-8h5z" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state - Category selected but no resources */}
        {!loading && active && filtered.length === 0 && (
          <div className="mt-14 grid place-items-center text-center text-gray-600">
            <div className="w-14 h-14 rounded-2xl bg-white shadow ring-1 ring-gray-100 grid place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7 text-gray-400"
              >
                <path d="M4 4h16v14H5.17L4 19.17Zm2 2v10h12V6ZM6 20h14v2H6Z" />
              </svg>
            </div>
            <p className="mt-3">No resources found for {active}</p>
          </div>
        )}

        {/* Upload Section - Only for logged-in users - At Bottom */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-12 max-w-3xl mx-auto px-4 md:px-0"
          >
            <div className="rounded-2xl border-2 border-mgsa-accent/30 bg-white/90 backdrop-blur-sm shadow-xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-black mb-6 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-mgsa-accent"
                >
                  <path d="M11 15h2V9h3l-4-5-4 5h3ZM4 19h16v2H4Z" />
                </svg>
                Upload Resource
              </h3>

              <form onSubmit={handleUpload} className="space-y-5">
                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Category *
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-mgsa-accent focus:border-mgsa-accent transition-all"
                    disabled={uploading}
                  >
                    <option value="">Select a category</option>
                    {COURSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File (PDF, DOCX, PPT, ZIP, PNG, JPG, JPEG - Max 30MB) *
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.docx,.ppt,.zip,.doc,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-mgsa-accent file:text-white hover:file:bg-mgsa-accentDark file:cursor-pointer outline-none focus:ring-2 focus:ring-mgsa-accent transition-all"
                  />
                  {uploadForm.file && (
                    <p className="mt-2 text-sm text-mgsa-accent font-medium">
                      Selected: {uploadForm.file.name} (
                      {(uploadForm.file.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {uploadError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm"
                  >
                    {uploadError}
                  </motion.div>
                )}

                {/* Progress Bar */}
                {uploading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-mgsa-accent to-mgsa-accentDark rounded-full"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Upload Button */}
                <motion.button
                  whileHover={{ scale: uploading ? 1 : 1.02 }}
                  whileTap={{ scale: uploading ? 1 : 0.98 }}
                  type="submit"
                  disabled={uploading}
                  className="w-full rounded-full bg-mgsa-accent hover:bg-mgsa-accentDark text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M11 15h2V9h3l-4-5-4 5h3ZM4 19h16v2H4Z" />
                      </svg>
                      Upload Resource
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Resources;

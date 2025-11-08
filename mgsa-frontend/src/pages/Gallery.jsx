import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Trash2,
  Loader2,
} from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { fetchGallery, uploadGalleryItem } from "../api/galleryService";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/auth-context";
import heroCover from "../assets/Gallery/IMG_8828.JPG";

const Gallery = () => {
  const navigate = useNavigate();
  const { user, token, isAdmin } = useAuth();
  const isAdminUser = isAdmin || user?.role === "admin";
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [modalError, setModalError] = useState("");

  // Track scroll position for hero fade effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate hero overlay opacity based on scroll (fades out as user scrolls)
  const heroOverlayOpacity = Math.max(0, 1 - scrollY / 400);

  const navigateImage = useCallback(
    (direction) => {
      setSelectedIndex((currentIndex) => {
        if (currentIndex === null) return null;
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < galleryItems.length) {
          return newIndex;
        }
        return currentIndex;
      });
    },
    [galleryItems.length]
  );

  const loadGallery = useCallback(async (withSpinner = true) => {
    try {
      if (withSpinner) setLoading(true);
      const items = await fetchGallery();
      setGalleryItems(Array.isArray(items) ? items : []);
      setError("");
    } catch (err) {
      console.error("Gallery fetch error:", err);
      setError(err.response?.data?.message || "Failed to load gallery images.");
    } finally {
      if (withSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery(true);
  }, [loadGallery]);

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;

      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowLeft") {
        navigateImage(-1);
      } else if (e.key === "ArrowRight") {
        navigateImage(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, navigateImage]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex]);

  // Handle touch swipe for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      navigateImage(1);
    }
    if (isRightSwipe) {
      navigateImage(-1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const closeModal = () => {
    setShowModal(false);
    setTitle("");
    setFile(null);
    setModalError("");
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setModalError("");

    if (!title.trim()) {
      setModalError("Title is required.");
      return;
    }

    if (!file) {
      setModalError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setModalError("File must be 10MB or smaller.");
      return;
    }

    try {
      setUploading(true);
      const payload = new FormData();
      payload.append("title", title.trim());
      payload.append("image", file);

      const response = await uploadGalleryItem(payload);
      await loadGallery(false);
      closeModal();
      setFeedback({
        type: "success",
        message: response.message || "Image uploaded successfully.",
      });
    } catch (err) {
      console.error("Gallery upload error:", err);
      setModalError(
        err.response?.data?.message ||
          err.message ||
          "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token || !isAdminUser) {
      setFeedback({
        type: "error",
        message: "You must be an admin to delete images.",
      });
      if (!token) {
        navigate("/login");
      }
      return;
    }

    if (!window.confirm("Delete this image? This action cannot be undone."))
      return;

    setDeletingId(id);

    try {
      const response = await axiosInstance.delete(`/gallery/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGalleryItems((prev) => {
        const removedIndex = prev.findIndex(
          (item) => (item._id || item.id) === id
        );
        const updated = prev.filter((item) => (item._id || item.id) !== id);

        setSelectedIndex((current) => {
          if (current === null) return null;
          if (!updated.length) return null;

          if (removedIndex === -1) {
            return current >= updated.length ? updated.length - 1 : current;
          }

          if (current === removedIndex) {
            return removedIndex >= updated.length
              ? updated.length - 1
              : removedIndex;
          }

          if (current > removedIndex) {
            return current - 1;
          }

          return current;
        });

        return updated;
      });

      setFeedback({
        type: "success",
        message: response.data?.message || "Image deleted successfully.",
      });
    } catch (err) {
      console.error("Gallery delete error:", err);
      setFeedback({
        type: "error",
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to delete image.",
      });
      await loadGallery(false);
    } finally {
      setDeletingId(null);
    }
  };

  const heroImage = heroCover;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-[#22C55E]/20 border-t-[#22C55E] rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] rounded-2xl border border-red-500/40 p-8 text-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Unable to load gallery
          </h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => loadGallery(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white relative">
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

        {/* Gradient accents - contained within viewport */}
        <div className="pointer-events-none absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-[#22C55E]/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#16A34A]/20 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Hero Section with Cover Image */}
      <section className="relative z-10 h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={galleryItems[0]?.title || "MGSA Gallery"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Overlay with Fade Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-[#0A0A0A]/30 to-transparent flex items-center justify-center"
          style={{ opacity: heroOverlayOpacity }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl"
            >
              📸 WellGo Program of 2017 GC
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium drop-shadow-lg"
            >
              Murti Guuto Students Association
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
              className="mt-6 h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-[#22C55E] to-transparent rounded-full"
            />
          </div>
        </motion.div>

        {/* Scroll Indicator - Centered */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: heroOverlayOpacity,
            y: [0, 12, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.6 },
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="absolute bottom-12 md:bottom-16 left-0 right-0 z-20 flex justify-center px-4"
        >
          <div className="px-6 py-3 md:px-10 md:py-5 rounded-full bg-[#0A0A0A]/70 backdrop-blur-lg border-2 border-[#22C55E]/50 shadow-[0_0_30px_rgba(34,197,94,0.4)] max-w-fit">
            <div className="flex items-center gap-2 md:gap-4">
              <motion.span
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-[#22C55E] text-xl md:text-3xl"
              >
                ↓
              </motion.span>
              <span className="text-white text-sm md:text-xl lg:text-2xl font-semibold whitespace-nowrap">
                Scroll to view all images
              </span>
              <motion.span
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-[#22C55E] text-xl md:text-3xl"
              >
                ↓
              </motion.span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Gallery Grid */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        {feedback.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 rounded-2xl border px-4 py-3 text-sm md:text-base shadow-lg backdrop-blur-md ${
              feedback.type === "success"
                ? "border-[#22C55E]/40 bg-[#22C55E]/10 text-[#CFFDD0]"
                : "border-red-500/40 bg-red-500/10 text-red-200"
            }`}
          >
            {feedback.message}
          </motion.div>
        )}

        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setModalError("");
              setShowModal(true);
            }}
            className="mb-10 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#22C55E] to-[#00FFC6] px-6 py-3 font-semibold text-white shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,197,94,0.6)]"
          >
            <UploadCloud className="h-5 w-5" /> Upload Image
          </motion.button>
        )}

        {galleryItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-dashed border-[#22C55E]/40 bg-[#111827]/60 p-12 text-center"
          >
            <h3 className="text-2xl font-bold text-white/80 mb-3">
              Gallery coming soon
            </h3>
            <p className="text-white/60">
              No images have been uploaded yet. Check back later for new
              memories!
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {galleryItems.map((item, index) => (
              <motion.div
                key={item._id || item.id || index}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-3xl border border-[#22C55E]/20 bg-[#0B1324]/50 shadow-[0_0_20px_rgba(34,197,94,0.15)] backdrop-blur-xl"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedIndex(index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedIndex(index);
                    }
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="block h-full w-full focus:outline-none"
                >
                  <LazyLoadImage
                    src={item.imageUrl}
                    alt={item.title}
                    effect="blur"
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    wrapperClassName="h-64 w-full"
                    placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%230a0a0a' width='400' height='400'/%3E%3C/svg%3E"
                  />
                </div>

                {/* Bottom-centered title + date overlay: always visible, tight semi-transparent backgrounds // flex-row items-center*/}

                <div className="absolute bottom-0 left-0 w-full flex justify-between items-center px-3 py-2 bg-gradient-to-t from-black/40 to-transparent z-20">
                  <span className="bg-black/30 text-white text-sm font-semibold backdrop-blur-sm shadow-sm">
                    {item.title}
                  </span>

                  <span className="bg-black/30 text-white/90 text-xs backdrop-blur-sm shadow-sm">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Admin delete button positioned top-right so bottom overlay stays clean */}
                {isAdminUser && (
                  <div className="absolute top-3 right-3 z-30">
                    <button
                      type="button"
                      aria-label="Delete image"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleDelete(item._id || item.id);
                      }}
                      disabled={deletingId === (item._id || item.id)}
                      className="flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-red-100 transition-all duration-200 hover:border-red-400 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === (item._id || item.id) ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-xs md:text-sm">
                            Deleting...
                          </span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          <span className="text-xs md:text-sm">Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="absolute inset-0 rounded-3xl ring-1 ring-transparent transition-all duration-500 group-hover:ring-[#22C55E]/70" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && galleryItems[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Subtle neon radial tint behind the lightbox for depth */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(34,197,94,0.06), rgba(0,0,0,0.55) 40%)",
                mixBlendMode: "screen",
              }}
            />
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-[#22C55E]/20 hover:bg-[#22C55E]/40 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Previous button */}
            {selectedIndex > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage(-1);
                }}
                className="absolute left-6 z-[110] p-3 rounded-full bg-[#22C55E]/20 hover:bg-[#22C55E]/40 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </motion.button>
            )}

            {/* Next button */}
            {selectedIndex < galleryItems.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage(1);
                }}
                className="absolute right-6 z-[110] p-3 rounded-full bg-[#22C55E]/20 hover:bg-[#22C55E]/40 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </motion.button>
            )}

            {/* Image container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-7xl max-h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Neon halo behind the image for futuristic glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-[60vw] h-[60vh] max-w-[1200px] max-h-[800px] bg-gradient-to-r from-[#22C55E]/30 via-[#00FFC6]/18 to-transparent rounded-full filter blur-3xl" />
              </div>
              <img
                src={galleryItems[selectedIndex].imageUrl}
                alt={galleryItems[selectedIndex].title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.3)]"
              />

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-[#22C55E]/20 backdrop-blur-sm text-white text-sm">
                {selectedIndex + 1} / {galleryItems.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-lg p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl rounded-3xl border border-[#22C55E]/30 bg-gradient-to-br from-[#0B1324] to-[#05080F] p-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-6 top-6 rounded-full bg-white/5 p-2 text-white transition hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-2xl font-bold text-white">
                Upload Gallery Image
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Add a new highlight to the MGSA gallery. Images are stored
                securely in Cloudinary.
              </p>

              <form onSubmit={handleUpload} className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#22C55E]/30 bg-transparent px-4 py-3 text-white outline-none transition focus:border-[#22C55E]/70"
                    placeholder="Sunset at the MGSA Meet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Image
                  </label>
                  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-[#22C55E]/40 bg-[#0B1A2C]/60 px-4 py-5 text-white/70 transition hover:border-[#22C55E]/70 hover:text-white">
                    <div className="flex items-center gap-3">
                      <UploadCloud className="h-6 w-6 text-[#22C55E]" />
                      <div>
                        <p className="font-semibold">
                          {file ? file.name : "Choose an image"}
                        </p>
                        <p className="text-xs text-white/50">
                          JPEG, PNG or WebP up to 10MB.
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <span className="rounded-full border border-[#22C55E]/40 px-3 py-1 text-xs text-[#22C55E]">
                      Browse
                    </span>
                  </label>
                </div>

                {modalError && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {modalError}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/70 transition hover:border-white/40 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="rounded-full bg-gradient-to-r from-[#22C55E] to-[#00FFC6] px-6 py-2 text-sm font-semibold text-white shadow-[0_0_25px_rgba(34,197,94,0.4)] transition hover:shadow-[0_0_35px_rgba(34,197,94,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

// backend/routes/files.js
// Cloudinary-only file upload system (10MB limit)

import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";
import Resource from "../models/Resource.js";
import streamifier from "streamifier";

const router = express.Router();

// Configure multer for memory storage only (10MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept all file types
    console.log(`📄 File received: ${file.originalname} (${file.mimetype})`);
    cb(null, true);
  },
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Determine file type category from MIME type
 * @param {string} mimeType - File MIME type
 * @returns {string} File category
 */
const getFileTypeCategory = (mimeType) => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("word") || mimeType.includes("msword")) return "word";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation"))
    return "powerpoint";
  if (mimeType.includes("sheet") || mimeType.includes("excel"))
    return "spreadsheet";
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z")
  )
    return "archive";
  return "document";
};

/**
 * Upload file buffer to Cloudinary using stream
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} originalName - Original filename
 * @param {string} folder - Cloudinary folder (default: mgsa_resources)
 * @param {string} mimeType - File MIME type
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = (fileBuffer, originalName, folder = "mgsa_resources", mimeType = "") => {
  return new Promise((resolve, reject) => {
    // Create unique public_id
    const publicId = `${originalName.split(".")[0].replace(/[^a-zA-Z0-9-_]/g, "_")}-${Date.now()}`;

    // Determine resource_type based on MIME type
    // Use "raw" for documents, "image" for images, "video" for videos
    let resourceType = "raw"; // Default to raw for documents
    
    if (mimeType.startsWith("image/")) {
      resourceType = "image";
    } else if (mimeType.startsWith("video/")) {
      resourceType = "video";
    }

    console.log(`☁️ Uploading to Cloudinary: ${publicId}`);
    console.log(`📋 Resource type: ${resourceType} (MIME: ${mimeType})`);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType, // Explicitly set resource type
        public_id: publicId,
        use_filename: true,
        unique_filename: false,
        timeout: 120000, // 2 minutes timeout for large files
        chunk_size: 6000000, // 6MB chunks for better upload reliability
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          console.error("Error details:", {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
          });
          reject(new Error(`Cloudinary upload failed: ${error.message || error.http_code || 'Unknown error'}`));
        } else {
          console.log("✅ Cloudinary upload success:", {
            public_id: result.public_id,
            secure_url: result.secure_url,
            format: result.format,
            bytes: result.bytes,
            resource_type: result.resource_type,
          });
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            bytes: result.bytes,
            format: result.format,
            resource_type: result.resource_type,
          });
        }
      }
    );

    // Pipe buffer to Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// ============================================
// UPLOAD ENDPOINT (Cloudinary-only)
// ============================================

/**
 * POST /api/resources/upload
 * Upload file to Cloudinary and save metadata to MongoDB
 * @requires Authentication (protect middleware)
 * @body {File} file - File to upload (max 30MB)
 * @body {string} title - Resource title (optional)
 * @body {string} description - Resource description (optional)
 * @body {string} course - Course name (optional, default: General)
 * @body {string} department - Department name (optional, default: N/A)
 */
router.post(
  "/upload",
  protect,
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("\n📤 ========== UPLOAD REQUEST ==========");
      console.log("👤 User:", req.user.email);
      console.log("📋 Body:", {
        title: req.body.title,
        course: req.body.course,
        department: req.body.department,
      });

      // Validate file exists
      if (!req.file) {
        console.log("❌ No file in request");
        return res.status(400).json({
          success: false,
          message: "No file uploaded. Please select a file.",
        });
      }

      // Validate file size (10MB max)
      const fileSizeMB = req.file.size / (1024 * 1024);
      
      if (fileSizeMB > 10) {
        console.log(`❌ File too large: ${fileSizeMB.toFixed(2)} MB`);
        return res.status(413).json({
          success: false,
          message: `File size (${fileSizeMB.toFixed(2)} MB) exceeds 10MB limit. Please use a smaller file.`,
        });
      }

      console.log("📄 File details:", {
        originalName: req.file.originalname,
        size: `${fileSizeMB.toFixed(2)} MB (${(req.file.size / 1024).toFixed(2)} KB)`,
        mimeType: req.file.mimetype,
        buffer: `${req.file.buffer.length} bytes`,
      });

      // Extract file metadata
      const fileExtension = req.file.originalname
        .split(".")
        .pop()
        .toLowerCase();
      const fileTypeCategory = getFileTypeCategory(req.file.mimetype);

      console.log("🔍 File type detected:", fileTypeCategory);
      console.log("📎 File extension:", fileExtension);

      // Upload to Cloudinary
      console.log("☁️ Starting Cloudinary upload...");
      const cloudinaryResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        "mgsa_resources",
        req.file.mimetype
      );

      console.log("✅ Cloudinary upload complete:", {
        public_id: cloudinaryResult.public_id,
        secure_url: cloudinaryResult.secure_url,
        format: cloudinaryResult.format,
        bytes: cloudinaryResult.bytes,
      });

      // Create Resource document with Cloudinary metadata
      const resource = new Resource({
        uploadedBy: req.user._id,
        filename: cloudinaryResult.public_id,
        originalName: req.file.originalname,
        title: req.body.title || req.file.originalname.replace(/\.[^.]+$/, ""),
        description: req.body.description || "",
        filePath: cloudinaryResult.secure_url,
        fileType: fileTypeCategory,
        mimeType: req.file.mimetype,
        fileExtension: fileExtension,
        fileSize: cloudinaryResult.bytes || req.file.size,
        course: req.body.course || "General",
        department: req.body.department || "N/A",
        storageProvider: "cloudinary",
        approved: false,
        downloads: 0,
      });

      await resource.save();

      console.log(
        `✅ Resource saved to MongoDB: ${resource.originalName} (ID: ${resource._id})`
      );
      console.log("========================================\n");

      // Return success response
      res.status(201).json({
        success: true,
        message: "File uploaded successfully to Cloudinary",
        provider: "cloudinary",
        file: {
          _id: resource._id,
          filename: resource.filename,
          originalName: resource.originalName,
          title: resource.title,
          description: resource.description,
          fileType: resource.fileType,
          fileExtension: resource.fileExtension,
          fileSize: resource.fileSize,
          mimeType: resource.mimeType,
          course: resource.course,
          department: resource.department,
          uploadedBy: {
            _id: req.user._id,
            fname: req.user.fname,
            lname: req.user.lname,
            email: req.user.email,
          },
          fileUrl: resource.filePath,
          publicId: resource.filename,
          storageProvider: "cloudinary",
          createdAt: resource.createdAt,
          approved: resource.approved,
          downloads: resource.downloads,
        },
      });
    } catch (err) {
      console.error("❌ Upload error:", err);
      console.error("Error stack:", err.stack);

      // Handle specific errors
      if (err.message && err.message.includes("Cloudinary")) {
        if (err.message.includes("File size too large") || err.message.includes("413")) {
          return res.status(413).json({
            success: false,
            message: "File size exceeds Cloudinary limit. Please use a smaller file.",
          });
        }
        
        if (err.message.includes("timeout") || err.message.includes("ETIMEDOUT")) {
          return res.status(408).json({
            success: false,
            message: "Upload timeout. Please try again or use a smaller file.",
          });
        }

        return res.status(500).json({
          success: false,
          message: `Cloudinary error: ${err.message}`,
        });
      }

      if (err.message && err.message.includes("File too large")) {
        return res.status(413).json({
          success: false,
          message: "File size exceeds 10MB limit",
        });
      }

      res.status(500).json({
        success: false,
        message: err.message || "Failed to upload file. Please try again.",
      });
    }
  }
);

// ✅ GET ALL FILES
router.get("/", async (req, res) => {
  try {
    const { course, department, fileType, approved } = req.query;
    const filter = {};
    if (course) filter.course = course;
    if (department) filter.department = department;
    if (fileType) filter.fileType = fileType;
    if (approved !== undefined) filter.approved = approved === "true";

    const files = await Resource.find(filter)
      .populate("uploadedBy", "fname lname email")
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    console.error("❌ Fetch files error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// DOWNLOAD ENDPOINT (Cloudinary-only)
// ============================================

/**
 * GET /api/resources/download/:id
 * Return Cloudinary URL for client-side download
 * @requires Authentication (protect middleware)
 * @param {string} id - Resource ID
 * @returns {Object} JSON with downloadUrl
 */
router.get("/download/:id", protect, async (req, res) => {
  try {
    console.log("\n📥 ========== DOWNLOAD REQUEST ==========");
    console.log(`📄 Resource ID: ${req.params.id}`);
    console.log(`👤 User: ${req.user.email}`);

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      console.log("❌ Resource not found in database");
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Increment download counter
    resource.downloads += 1;
    await resource.save();

    console.log(`✅ File: ${resource.originalName}`);
    console.log(`📊 Size: ${(resource.fileSize / 1024).toFixed(2)} KB`);
    console.log(`📈 Download count: ${resource.downloads}`);
    console.log(`☁️ Cloudinary URL: ${resource.filePath}`);

    // Fix URL for non-image files (PDFs, docs, etc.)
    // Old uploads might have /image/upload/ but need special handling
    let downloadUrl = resource.filePath;
    
    if (!resource.mimeType.startsWith("image/") && downloadUrl.includes("/image/upload/")) {
      // For files incorrectly uploaded as images, use fl_attachment flag
      // This forces download instead of display
      const parts = downloadUrl.split("/upload/");
      if (parts.length === 2) {
        downloadUrl = `${parts[0]}/upload/fl_attachment/${parts[1]}`;
        console.log(`🔧 Added download flag for non-image file: ${downloadUrl}`);
      }
    }

    console.log("========================================\n");

    // Return JSON with Cloudinary URL (frontend will use window.open)
    return res.json({
      success: true,
      downloadUrl: downloadUrl,
      filename: resource.originalName,
      fileType: resource.fileType,
      fileSize: resource.fileSize,
      mimeType: resource.mimeType,
    });
  } catch (err) {
    console.error("❌ Download error:", err);
    console.error("Error stack:", err.stack);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to process download",
    });
  }
});

// ✅ GET SINGLE FILE
router.get("/:id", async (req, res) => {
  try {
    const file = await Resource.findById(req.params.id).populate(
      "uploadedBy",
      "fname lname email"
    );

    if (!file) return res.status(404).json({ message: "File not found" });

    res.json(file);
  } catch (err) {
    console.error("❌ Get file error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;

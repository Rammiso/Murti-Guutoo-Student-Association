import express from "express";
import multer from "multer";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";
import Gallery from "../models/Gallery.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
  },
});

router.post(
  "/upload",
  protect,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const { title, description } = req.body;
      if (!title?.trim()) {
        return res
          .status(400)
          .json({ success: false, message: "Title is required" });
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "mgsa_gallery",
            resource_type: "image",
            transformation: [
              { width: 1600, height: 1200, crop: "limit" },
              { quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      const galleryItem = await Gallery.create({
        title: title.trim(),
        description: description?.trim() || "",
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        uploadedBy: req.user._id,
      });

      res.status(201).json({
        success: true,
        imageUrl: galleryItem.imageUrl,
        title: galleryItem.title,
        description: galleryItem.description,
        id: galleryItem._id,
        createdAt: galleryItem.createdAt,
      });
    } catch (err) {
      console.error("Gallery upload error:", err);
      const status = err.message?.includes("Only JPEG") ? 400 : 500;
      res.status(status).json({
        success: false,
        message: status === 400 ? err.message : "Upload failed",
        error: err.message,
      });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const items = await Gallery.find()
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "fname lname email");
    res.json(items);
  } catch (err) {
    console.error("Gallery fetch error:", err);
    res.status(500).json({ message: "Failed to fetch gallery" });
  }
});

router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (item.publicId) {
      try {
        // Attempt to destroy the image on Cloudinary. Use invalidate to clear cached CDN files.
        const destroyResult = await cloudinary.uploader.destroy(item.publicId, {
          resource_type: "image",
          invalidate: true,
        });

        // Log destroy result for debugging; Cloudinary returns { result: 'ok' } or 'not_found'
        console.log(
          "Cloudinary destroy result for",
          item.publicId,
          ":",
          destroyResult
        );
      } catch (cloudinaryErr) {
        // Do not fail the whole delete if Cloudinary can't be reached — proceed with DB cleanup
        console.error("Failed to delete Cloudinary image:", cloudinaryErr);
      }
    }

    try {
      await Gallery.findByIdAndDelete(id);
      return res.json({ success: true, message: "Image deleted" });
    } catch (dbErr) {
      console.error("Failed to delete gallery DB record:", dbErr);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete image record" });
    }
  } catch (err) {
    console.error("Gallery delete error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: err.message || "Failed to delete image",
      });
  }
});

export default router;

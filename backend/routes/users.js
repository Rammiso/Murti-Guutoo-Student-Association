// routes/user.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { protect } from "../middleware/authMiddleware.js"; // your auth middleware
import User from "../models/User.js";
import { uploadProfile } from "../middleware/uploadProfile.js";

const router = express.Router();


const upload =uploadProfile;

// --- Route: upload or update profile picture ---
router.post("/upload-profile", protect, upload.single("profilePic"), async (req, res) => {
  try {
    // multer has already validated file exists and size/type
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      // delete uploaded file if user not found
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: "User not found" });
    }

    // Delete previous profile picture file from disk (if stored locally)
    if (user.profilePicUrl && typeof user.profilePicUrl === "string") {
      try {
        // If saved as '/uploads/profilePics/filename.ext' or 'uploads/profilePics/filename.ext'
        const prev = user.profilePicUrl.replace(/^\/+/,""); // remove leading slash
        const prevPath = path.join(process.cwd(), prev);
        if (fs.existsSync(prevPath) && prevPath.startsWith(UPLOAD_DIR)) {
          fs.unlinkSync(prevPath);
        }
      } catch (err) {
        // log but do not fail the request
        console.error("Failed to delete previous profile pic:", err.message);
      }
    }

    // Save new URL (use a public path served by express static)
    const publicPath = `/uploads/profilePics/${req.file.filename}`; // accessible via server static route
    user.profilePicUrl = publicPath;
    await user.save();

    res.json({
      message: "Profile picture updated successfully",
      profilePicUrl: publicPath
    });
  } catch (err) {
    console.error("Upload error:", err);
    // multer errors handled by error handler below; fallback:
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// OPTIONAL: get current user's profile
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -passwordHash -__v");
  res.json(user);
});

export default router;

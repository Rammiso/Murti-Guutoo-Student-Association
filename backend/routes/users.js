// routes/user.js
import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Multer memory storage for Cloudinary uploads
const storage = multer.memoryStorage();
const uploadMemory = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
  },
});

// Upload or update profile picture (Cloudinary)
router.post(
  "/profile-pic",
  protect,
  uploadMemory.single("profilePic"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Delete existing image from Cloudinary
      if (user.profilePicId) {
        try {
          await cloudinary.uploader.destroy(user.profilePicId);
        } catch (err) {
          console.error("Failed to delete Cloudinary image:", err.message);
        }
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "mgsa_profile_pics",
            resource_type: "image",
            transformation: [
              { width: 500, height: 500, crop: "limit" },
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

      user.profilePicUrl = uploadResult.secure_url;
      user.profilePicId = uploadResult.public_id;
      await user.save();

      return res.json({
        success: true,
        message: "Profile picture updated successfully",
        profilePicUrl: uploadResult.secure_url,
      });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      const status = err.message?.includes("Only JPEG") ? 400 : 500;
      return res.status(status).json({
        success: false,
        message: status === 400 ? err.message : "Upload failed",
        error: err.message,
      });
    }
  }
);

// Get current user's profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update user profile (name, phone, etc.)
router.put("/update-profile", protect, async (req, res) => {
  try {
    const {
      fname,
      lname,
      mname,
      phone,
      gender,
      zone,
      woreda,
      year,
      college,
      department,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (fname) user.fname = fname;
    if (lname !== undefined) user.lname = lname;
    if (mname !== undefined) user.mname = mname;
    if (phone !== undefined) user.phone = phone;
    if (gender) user.gender = gender;
    if (zone) user.zone = zone;
    if (woreda !== undefined) user.woreda = woreda;
    if (year !== undefined) user.year = year;
    if (college !== undefined) user.college = college;
    if (department !== undefined) user.department = department;

    await user.save();

    console.log(`✅ Profile updated for user: ${user.email}`);

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        mname: user.mname,
        phone: user.phone,
        email: user.email,
        gender: user.gender,
        zone: user.zone,
        woreda: user.woreda,
        year: user.year,
        college: user.college,
        department: user.department,
        profilePicUrl: user.profilePicUrl,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Change password
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Find user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log(`✅ Password changed for user: ${user.email}`);

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Delete profile picture (Cloudinary)
router.delete("/delete-profile-pic", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profilePicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicId);
      } catch (err) {
        console.error("Failed to delete Cloudinary image:", err.message);
      }
    }

    user.profilePicUrl = "";
    user.profilePicId = "";
    await user.save();

    res.json({ message: "Profile picture deleted successfully" });
  } catch (err) {
    console.error("Delete profile pic error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;

import express from "express";
import User from "../models/User.js";
import Resource from "../models/Resource.js";
import Contact from "../models/Contact.js";
import fs from "fs";
import path from "path";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/users", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      res.json({ message: "users is not founded" });
    }
    res.json(users);
  } catch (error) {
    res.json({ message: error.message });
  }
});
// Delete user
router.delete("/users/:id", protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Delete profile picture if exists
    if (user.profilePic) {
      try {
        fs.unlinkSync(path.join(process.cwd(), user.profilePic));
      } catch (err) {
        console.log("Profile pic already deleted or doesn't exist");
      }
    }
    
    await user.deleteOne();
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve resource
router.put("/resources/approve/:id", protect, isAdmin, async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ message: "Resource not found" });
  resource.approved = true;
  await resource.save();
  res.json({ message: "Resource approved", resource });
});

// Delete resource
router.delete("/resources/:id", protect, isAdmin, async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ message: "Resource not found" });
  fs.unlinkSync(path.join(process.cwd(), resource.fileUrl));
  await resource.deleteOne();
  res.json({ message: "Resource deleted" });
});

// Search user by email or phone
router.get("/users/search", protect, isAdmin, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Search by email or phone
    const user = await User.findOne({
      $or: [{ email: query.toLowerCase() }, { phone: query }],
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User found:", user.email);
    res.json(user);
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update user role (promote/demote admin)
router.patch("/users/:id/role", protect, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    // Check if requesting user is main admin
    // req.user is already the full user object from protect middleware
    if (!req.user.mainAdmin) {
      console.log("❌ User is not main admin:", req.user.email);
      return res.status(403).json({
        message: "Only main admin can modify user roles",
      });
    }

    console.log("✅ Main admin verified:", req.user.email);

    // Validate role
    if (!["student", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Find and update user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent main admin from demoting themselves
    if (user.mainAdmin && role === "student") {
      return res.status(400).json({
        message: "Cannot demote main admin",
      });
    }

    user.role = role;
    await user.save();

    console.log(`✅ User ${user.email} role updated to ${role}`);
    res.json({
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Role update error:", error);
    res.status(500).json({ message: error.message });
  }
});
// get all contacts
router.get("/contact", protect, isAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate("sender", "fname lname email")
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete contact message
router.delete("/contact/:id", protect, isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }
    await contact.deleteOne();
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

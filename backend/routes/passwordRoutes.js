// routes/passwordRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================
// 🔐 1. CHANGE PASSWORD (logged-in user)
// ===============================
router.put("/change-password", protect, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.verifyPassword(oldPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect old password" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===============================
// 🔑 2. FORGOT PASSWORD - STEP 1 (Verify user details)
// ===============================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, fname, phone } = req.body;

    if (!email || !fname || !phone)
      return res.status(400).json({ message: 'All fields are required' });

    // Find user by email, first name, and phone
    const user = await User.findOne({ email, fname, phone });
    if (!user)
      return res.status(404).json({ message: 'User not found. Please check your details.' });

    // Generate a temporary token (simple approach - in production use JWT or crypto)
    const tempToken = Buffer.from(`${user._id}:${Date.now()}`).toString('base64');

    res.json({ 
      message: 'User verified successfully',
      tempToken,
      userId: user._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to verify user', error: err.message });
  }
});

// ===============================
// 🔑 3. RESET PASSWORD - STEP 2 (Reset with token)
// ===============================
router.post('/reset-password', async (req, res) => {
  try {
    const { tempToken, newPassword, confirmPassword } = req.body;

    if (!tempToken || !newPassword || !confirmPassword)
      return res.status(400).json({ message: 'All fields are required' });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match' });

    if (newPassword.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });

    // Decode the token to get userId
    const decoded = Buffer.from(tempToken, 'base64').toString('utf-8');
    const [userId, timestamp] = decoded.split(':');

    // Check if token is expired (15 minutes)
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > 15 * 60 * 1000) {
      return res.status(400).json({ message: 'Token expired. Please start over.' });
    }

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reset password', error: err.message });
  }
});

export default router;

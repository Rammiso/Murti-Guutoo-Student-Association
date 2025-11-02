// routes/passwordRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


// ===============================
// 🔐 1. CHANGE PASSWORD (logged-in user)
// ===============================
router.put('/change-password', protect, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ message: 'All fields are required' });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.verifyPassword(oldPassword);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// ===============================
// 🔑 2. FORGOT PASSWORD (check email + name)
// ===============================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, name, newPassword, confirmPassword } = req.body;

    if (!email || !name || !newPassword || !confirmPassword)
      return res.status(400).json({ message: 'All fields are required' });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match' });

    const user = await User.findOne({ email, name });
    if (!user)
      return res.status(404).json({ message: 'User not found. Please check your email and name.' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reset password', error: err.message });
  }
});

export default router;

import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {
  registerValidation,
  loginValidation,
} from "../middleware/validation.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

const router = express.Router();

/// Register
router.post("/register", async (req, res) => {
  try {
    // Destructure new inputs
    let {
      email,
      password,
      studentId,
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
      role = "student", // default role if not provided
    } = req.body;

    // Validation (adjust validation schema accordingly)
    const { error } = registerValidation(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    // Check if studentId already exists
    const studentIdExists = await User.findOne({ studentId });
    if (studentIdExists)
      return res.status(400).json({ message: "Student ID already in use" });

    // Create new user
    const user = new User({
      email,
      password,
      studentId,
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
      role,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error } = loginValidation(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const valid = await user.verifyPassword(password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token,
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role,
        mainAdmin: user.mainAdmin || false,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/user/me", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, "your-secret", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    res.json(decoded); // { id, fname, role, ... }
  });
});

export default router;

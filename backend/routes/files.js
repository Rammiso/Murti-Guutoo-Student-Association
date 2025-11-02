import express from "express";
import uploadResource from "../middleware/uploadResource.js";
import { protect } from "../middleware/authMiddleware.js";
import Resource from "../models/Resource.js";

const router = express.Router();
// ✅ Use the imported middleware here
router.post("/upload",protect, uploadResource.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileType = req.file.mimetype.startsWith("image/") ? "image" : "document";
    const file = new Resource({
      uploadedBy: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      description: req.body.description,
      fileType,
    });

    await file.save();
    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get all files
router.get("/", async (req, res) => {
  try {
    const files = await Resource.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;

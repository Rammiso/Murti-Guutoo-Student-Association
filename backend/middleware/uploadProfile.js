import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads", "profiles");

// Auto-create directory if missing
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`✅ Created profile upload directory: ${uploadDir}`);
  } else {
    console.log(`✅ Profile upload directory exists: ${uploadDir}`);
  }
} catch (error) {
  console.error(`❌ Failed to create profile upload directory: ${error.message}`);
  throw error;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure directory exists before saving
    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`✅ Created profile directory on-demand: ${uploadDir}`);
      } catch (error) {
        console.error(`❌ Failed to create directory: ${error.message}`);
        return cb(error);
      }
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

export const uploadProfile = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only image files (JPEG, PNG, GIF) are allowed!"), false);
    }
    cb(null, true);
  }
});

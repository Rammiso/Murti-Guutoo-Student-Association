// backend/middleware/uploadResource.js

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Use Cloudinary storage instead of local folder
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Dynamically set folder + filename
    return {
      folder: "mgsa_resources", // Your Cloudinary folder
      resource_type: "auto", // Auto-detects file type (PDF, DOC, IMG, etc.)
      public_id: file.originalname.split(".")[0] + "-" + Date.now(),
      format: undefined, // keep original format
    };
  },
});

// ✅ Initialize multer with Cloudinary storage
const uploadResource = multer({ storage });

export default uploadResource;

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadDir = path.join(process.cwd(), "uploads", "resources");

// // ✅ Auto-create directory if missing with error handling
// try {
//   if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//     console.log(`✅ Created upload directory: ${uploadDir}`);
//   } else {
//     console.log(`✅ Upload directory exists: ${uploadDir}`);
//   }
// } catch (error) {
//   console.error(`❌ Failed to create upload directory: ${error.message}`);
//   throw error;
// }

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     // Ensure directory exists before saving file
//     if (!fs.existsSync(uploadDir)) {
//       try {
//         fs.mkdirSync(uploadDir, { recursive: true });
//         console.log(`✅ Created upload directory on-demand: ${uploadDir}`);
//       } catch (error) {
//         console.error(`❌ Failed to create directory: ${error.message}`);
//         return cb(error);
//       }
//     }
//     cb(null, uploadDir);
//   },
//   filename(req, file, cb) {
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
//     cb(null, uniqueName);
//   },
// });

// const uploadResource = multer({ storage });
// export default uploadResource;

import multer from "multer";
import path from "path";

export const uploadProfile = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/profiles"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg","image/png","image/jpg"];
    if(!allowed.includes(file.mimetype)) return cb(new Error("Only image files!"), false);
    cb(null, true);
  }
});

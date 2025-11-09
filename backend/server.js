import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import resourceRoutes from "./routes/files.js";
import profile from "./routes/users.js";
import contactRoutes from "./routes/contacts.js";
import galleryRoutes from "./routes/gallery.js";
import paymentRoutes from "./routes/payments.js";
import { ensureMainAdmin } from "./scripts/setMainAdmin.js";

dotenv.config();

const app = express();

// CORS configuration to allow credentials

const allowedOrigins = [
  "http://localhost:5173",
  "https://murti-guutoo-student-association-ze.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://murti-guutoo-student-association-ze.vercel.app", // your deployed frontend https://murti-guutoo-student-association-ze.vercel.app/
// ];
// app.use(
//   cors({
//     origin: allowedOrigins, // Frontend URL
//     credentials: true, // Allow credentials (cookies, authorization headers)
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(express.json({ limit: "10mb" })); // Increased limit for payment screenshots
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Example: Express

app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordRoutes); // Password reset routes under /api/auth
app.use("/api/admin", adminRoutes);
app.use("/api/user", profile);
app.use("/api/resources", resourceRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/gallery", galleryRoutes);
// Mount payments on both paths for compatibility (/payments preferred)
app.use("/payments", paymentRoutes);
app.use("/api/payments", paymentRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await ensureMainAdmin();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

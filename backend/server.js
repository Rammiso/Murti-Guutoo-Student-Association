import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import passwordRoutes from './routes/passwordRoutes.js';
import resourceRoutes from "./routes/files.js";
import profile from './routes/users.js';
import path from "path";
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Example: Express

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use('api/user/profile',profile)
app.use('/api/password', passwordRoutes); 
app.use("/api/resources", resourceRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`));

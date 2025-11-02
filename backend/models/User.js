import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },

    // New personal info fields
    fname: { type: String, required: true },
    lname: { type: String, default: "" },
    mname: { type: String, default: "" },
    gender: { type: String, enum: ["Male", "Female", "other"], default: "" },

    // Academic info
    zone: { type: String, enum: ["West Hararghe","East Hararghe"], required: true },
    woreda: { type: String, default: "" },
    year: { type: String, default: "" },
    college: { type: String, default: "" },
    department: { type: String, default: "" },

    // Profile
    profilePicUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


export default mongoose.model("User", userSchema);

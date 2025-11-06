import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    studentId: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    mainAdmin: { type: Boolean, default: false },
    // New personal info fields
    fname: { type: String, required: true },
    lname: { type: String, default: "" },
    mname: { type: String, default: "" },
    phone: { type: String, default: "" },
    gender: { type: String, enum: ["Male", "Female", "other"], default: "" },

    // Academic info
    zone: {
      type: String,
      enum: ["West Hararghe", "East Hararghe", "Dire Dawa", "Harar"],
      required: true,
    },
    woreda: { type: String, default: "" },
    year: { type: String, default: "" },
    college: { type: String, default: "" },
    department: { type: String, default: "" },

    // Profile
    profilePicUrl: { type: String, default: "" },
    profilePicId: { type: String, default: "" }, // Cloudinary public_id
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to verify password
userSchema.methods.verifyPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    // File type category
    fileType: {
      type: String,
      enum: ["image", "document", "pdf", "word", "powerpoint", "archive"],
      default: "document",
    },
    // MIME type (e.g., application/pdf, image/jpeg)
    mimeType: {
      type: String,
      required: true,
    },
    // File extension (e.g., pdf, docx, jpg)
    fileExtension: {
      type: String,
      required: true,
    },
    // File size in bytes
    fileSize: {
      type: Number,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    // Storage provider (cloudinary or uploadthing)
    storageProvider: {
      type: String,
      enum: ["cloudinary", "uploadthing"],
      default: "cloudinary",
    },
    // Academic categorization
    course: {
      type: String,
      default: "General",
    },
    department: {
      type: String,
      default: "N/A",
    },
    // Download tracking
    downloads: {
      type: Number,
      default: 0,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);

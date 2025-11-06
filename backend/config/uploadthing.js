// backend/config/uploadthing.js
// UploadThing configuration for large file uploads (>10MB)

import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

// UploadThing API endpoints
const UPLOADTHING_API_BASE = "https://api.uploadthing.com";

// Decode UploadThing token to get actual API key
let UPLOADTHING_SECRET_KEY = process.env.UPLOADTHING_API_KEY;

try {
  // The token might be base64 encoded JSON
  if (UPLOADTHING_SECRET_KEY && UPLOADTHING_SECRET_KEY.startsWith("eyJ")) {
    const decoded = Buffer.from(UPLOADTHING_SECRET_KEY, "base64").toString("utf-8");
    const tokenData = JSON.parse(decoded);
    UPLOADTHING_SECRET_KEY = tokenData.apiKey || UPLOADTHING_SECRET_KEY;
    console.log("✅ Decoded UploadThing token");
  }
} catch (error) {
  console.log("ℹ️ Using UploadThing token as-is");
}

/**
 * Upload file to UploadThing for large files (>10MB)
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File MIME type (optional)
 * @returns {Promise<Object>} Upload result with url and key
 */
export async function uploadToUploadThing(fileBuffer, originalName, mimeType = "application/octet-stream") {
  try {
    console.log("\n☁️ ========== UPLOADTHING UPLOAD ==========");
    console.log(`📄 File: ${originalName}`);
    console.log(`📊 Size: ${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`📋 MIME: ${mimeType}`);

    // Validate API key
    if (!UPLOADTHING_SECRET_KEY) {
      throw new Error("UPLOADTHING_API_KEY is not configured in .env file");
    }

    // Step 1: Request upload URL (prepare upload)
    console.log("🔑 Step 1: Requesting upload URL...");
    
    const prepareResponse = await axios.post(
      `${UPLOADTHING_API_BASE}/v6/prepareUpload`,
      {
        files: [
          {
            name: originalName,
            size: fileBuffer.length,
            type: mimeType,
          },
        ],
        routeConfig: {
          maxFileSize: "32MB",
          maxFileCount: 1,
        },
        callbackUrl: "https://your-app.com/api/uploadthing/callback",
        callbackSlug: "fileUploader",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Uploadthing-Api-Key": UPLOADTHING_SECRET_KEY,
        },
      }
    );

    console.log("📥 Prepare response:", JSON.stringify(prepareResponse.data, null, 2));

    if (!prepareResponse.data?.data?.[0]) {
      console.error("❌ Invalid prepare response");
      throw new Error("Failed to prepare upload");
    }

    const uploadInfo = prepareResponse.data.data[0];
    const { url: uploadUrl, key: fileKey, fields } = uploadInfo;

    // Step 2: Upload file to the provided URL
    console.log("🚀 Step 2: Uploading file...");
    console.log("🔗 Upload URL:", uploadUrl);
    console.log("🔑 File key:", fileKey);

    const formData = new FormData();
    
    // Add fields if provided
    if (fields) {
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    
    // Add the file
    formData.append("file", fileBuffer, {
      filename: originalName,
      contentType: mimeType,
    });

    await axios.post(uploadUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 300000,
    });

    console.log("✅ File uploaded successfully");

    // Step 3: Mark upload as complete
    console.log("⏳ Step 3: Marking upload as complete...");
    
    try {
      await axios.post(
        `${UPLOADTHING_API_BASE}/v6/completeUpload`,
        {
          fileKey: fileKey,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Uploadthing-Api-Key": UPLOADTHING_SECRET_KEY,
          },
        }
      );
      console.log("✅ Upload marked as complete");
    } catch (err) {
      console.log("ℹ️ Complete step optional, file should still be accessible");
    }

    const fileUrl = `https://utfs.io/f/${fileKey}`;

    console.log("✅ UploadThing upload success:", {
      url: fileUrl,
      key: fileKey,
      size: fileBuffer.length,
    });
    console.log("==========================================\n");

    return {
      url: fileUrl,
      key: fileKey,
      size: fileBuffer.length,
      name: originalName,
    };
  } catch (error) {
    console.error("❌ UploadThing upload failed:", error.message);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error code:", error.code);
    
    // Handle specific errors
    if (error.response) {
      console.error("❌ Response status:", error.response.status);
      console.error("❌ Response statusText:", error.response.statusText);
      console.error("❌ Response data:", JSON.stringify(error.response.data, null, 2));
      console.error("❌ Response headers:", error.response.headers);
      
      if (error.response.status === 401 || error.response.status === 403) {
        throw new Error("UploadThing authentication failed - check API key");
      } else if (error.response.status === 413) {
        throw new Error("File too large for UploadThing");
      } else if (error.response.status === 429) {
        throw new Error("UploadThing rate limit exceeded");
      } else if (error.response.status === 400) {
        throw new Error(`UploadThing bad request: ${JSON.stringify(error.response.data)}`);
      }
    } else if (error.code === "ECONNABORTED") {
      throw new Error("UploadThing upload timeout - file too large or slow connection");
    } else if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      throw new Error("Cannot connect to UploadThing - check network connection");
    }
    
    console.error("❌ Full error stack:", error.stack);
    throw new Error(`UploadThing upload error: ${error.message}`);
  }
}

/**
 * Delete file from UploadThing
 * @param {string} fileKey - UploadThing file key
 * @returns {Promise<boolean>} Success status
 */
export async function deleteFromUploadThing(fileKey) {
  try {
    console.log(`🗑️ Deleting from UploadThing: ${fileKey}`);

    if (!UPLOADTHING_SECRET_KEY) {
      throw new Error("UPLOADTHING_API_KEY is not configured");
    }

    await axios.post(
      `${UPLOADTHING_API_BASE}/v6/deleteFiles`,
      {
        fileKeys: [fileKey],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Uploadthing-Api-Key": UPLOADTHING_SECRET_KEY,
        },
      }
    );

    console.log("✅ File deleted from UploadThing");
    return true;
  } catch (error) {
    console.error("❌ UploadThing delete failed:", error.message);
    return false;
  }
}

// Log configuration status
console.log("✅ UploadThing configured:", {
  api_key: UPLOADTHING_SECRET_KEY ? `***${UPLOADTHING_SECRET_KEY.slice(-4)}` : "missing",
  endpoint: UPLOADTHING_API_BASE,
  key_length: UPLOADTHING_SECRET_KEY?.length,
});

export default {
  uploadToUploadThing,
  deleteFromUploadThing,
};

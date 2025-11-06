# File Upload & Download System - Complete Guide

## Overview
Complete file management system supporting multiple file types (PDF, DOCX, PPTX, images, archives) with upload, download, and metadata tracking.

## Supported File Types

### Documents
- **PDF**: `.pdf` - `application/pdf`
- **Word**: `.doc`, `.docx` - `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **PowerPoint**: `.ppt`, `.pptx` - `application/vnd.ms-powerpoint`, `application/vnd.openxmlformats-officedocument.presentationml.presentation`

### Images
- **JPEG**: `.jpg`, `.jpeg` - `image/jpeg`
- **PNG**: `.png` - `image/png`
- **GIF**: `.gif` - `image/gif`

### Archives
- **ZIP**: `.zip` - `application/zip`
- **RAR**: `.rar` - `application/x-rar-compressed`

## Database Schema

### Resource Model
```javascript
{
  uploadedBy: ObjectId,           // User who uploaded
  filename: String,                // Stored filename (unique)
  originalName: String,            // Original filename
  title: String,                   // Display title
  description: String,             // File description
  fileType: String,                // Category: pdf, word, powerpoint, image, archive
  mimeType: String,                // MIME type
  fileExtension: String,           // Extension without dot
  fileSize: Number,                // Size in bytes
  filePath: String,                // Full path on server
  course: String,                  // Course category
  department: String,              // Department
  downloads: Number,               // Download count
  approved: Boolean,               // Admin approval status
  createdAt: Date,                 // Upload timestamp
  updatedAt: Date                  // Last update
}
```

## Backend API Endpoints

### 1. Upload File
```
POST /api/resources/upload
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```javascript
{
  file: File,                    // Required
  title: String,                 // Optional (defaults to filename)
  description: String,           // Optional
  course: String,                // Optional (defaults to "General")
  department: String             // Optional (defaults to "N/A")
}
```

**Response (201):**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "_id": "507f1f77bcf86cd799439011",
    "filename": "1762128001703-198929913.pdf",
    "originalName": "lecture-notes.pdf",
    "title": "lecture-notes",
    "description": "Uploaded by user@example.com",
    "fileType": "pdf",
    "fileExtension": "pdf",
    "fileSize": 2048576,
    "mimeType": "application/pdf",
    "course": "Mathematics",
    "department": "Natural Sciences",
    "uploadedBy": "507f1f77bcf86cd799439012",
    "createdAt": "2025-11-03T00:00:00.000Z",
    "approved": false
  }
}
```

### 2. Get All Files
```
GET /api/resources
Optional Query Parameters:
  - course: String
  - department: String
  - fileType: String
  - approved: Boolean
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "filename": "1762128001703-198929913.pdf",
    "originalName": "lecture-notes.pdf",
    "title": "lecture-notes",
    "fileType": "pdf",
    "fileExtension": "pdf",
    "fileSize": 2048576,
    "course": "Mathematics",
    "uploadedBy": {
      "_id": "507f1f77bcf86cd799439012",
      "fname": "John",
      "lname": "Doe",
      "email": "john@example.com"
    },
    "downloads": 5,
    "createdAt": "2025-11-03T00:00:00.000Z"
  }
]
```

### 3. Download File
```
GET /api/resources/download/:id
Headers: Authorization: Bearer <token>
```

**Response (200):**
- Content-Type: [file's MIME type]
- Content-Disposition: attachment; filename="[original filename]"
- Content-Length: [file size]
- Body: File stream

**Features:**
- ✅ Increments download counter
- ✅ Streams file (efficient for large files)
- ✅ Sets proper headers for browser download
- ✅ Logs download activity

### 4. Get Single File Details
```
GET /api/resources/:id
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "filename": "1762128001703-198929913.pdf",
  "originalName": "lecture-notes.pdf",
  "title": "lecture-notes",
  "description": "Comprehensive notes",
  "fileType": "pdf",
  "fileExtension": "pdf",
  "fileSize": 2048576,
  "mimeType": "application/pdf",
  "course": "Mathematics",
  "department": "Natural Sciences",
  "uploadedBy": {
    "_id": "507f1f77bcf86cd799439012",
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com"
  },
  "downloads": 5,
  "approved": false,
  "createdAt": "2025-11-03T00:00:00.000Z",
  "updatedAt": "2025-11-03T00:00:00.000Z"
}
```

## Frontend Integration

### Upload Example
```javascript
import { uploadResource } from "../api/resourceService";

const formData = new FormData();
formData.append("file", fileObject);
formData.append("title", "My Document");
formData.append("course", "Mathematics");
formData.append("department", "Natural Sciences");
formData.append("description", "Lecture notes for Chapter 5");

const result = await uploadResource(formData, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

if (result.success) {
  console.log("File uploaded:", result.resource);
}
```

### Download Example
```javascript
import { downloadResource } from "../api/resourceService";

const handleDownload = async (resourceId, filename) => {
  const result = await downloadResource(resourceId, filename);
  
  if (result.success) {
    console.log("Download started");
  }
};

// Usage
handleDownload("507f1f77bcf86cd799439011", "lecture-notes.pdf");
```

### Fetch Resources Example
```javascript
import { getResources } from "../api/resourceService";

// Get all resources
const allResources = await getResources();

// Get filtered resources
const mathResources = await getResources({ course: "Mathematics" });
const pdfFiles = await getResources({ fileType: "pdf" });
const approvedFiles = await getResources({ approved: true });
```

## File Type Detection

### Automatic Categorization
```javascript
const getFileTypeCategory = (mimeType) => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("word")) return "word";
  if (mimeType.includes("powerpoint")) return "powerpoint";
  if (mimeType.includes("zip")) return "archive";
  return "document";
};
```

### MIME Type Mapping
| Extension | MIME Type | Category |
|-----------|-----------|----------|
| .pdf | application/pdf | pdf |
| .doc | application/msword | word |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document | word |
| .ppt | application/vnd.ms-powerpoint | powerpoint |
| .pptx | application/vnd.openxmlformats-officedocument.presentationml.presentation | powerpoint |
| .jpg, .jpeg | image/jpeg | image |
| .png | image/png | image |
| .zip | application/zip | archive |

## File Storage

### Directory Structure
```
backend/
└── uploads/
    └── resources/
        ├── 1762128001703-198929913.pdf
        ├── 1762128007745-571892905.docx
        └── 1762128015234-892341567.jpg
```

### Filename Generation
```javascript
const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(originalname);
// Example: 1762128001703-198929913.pdf
```

## Security Features

### Upload Protection
- ✅ JWT authentication required
- ✅ File size validation (30MB max)
- ✅ File type validation
- ✅ Unique filename generation
- ✅ Directory auto-creation

### Download Protection
- ✅ JWT authentication required
- ✅ File existence verification
- ✅ Download tracking
- ✅ Proper MIME type headers

## Error Handling

### Upload Errors
```javascript
// No file provided
{ message: "No file uploaded" }

// File too large
{ message: "File size exceeds 30MB limit" }

// Invalid file type
{ message: "Invalid file type" }

// Server error
{ message: "Upload failed. Please try again." }
```

### Download Errors
```javascript
// File not found in database
{ message: "File not found" }

// File not found on disk
{ message: "File not found on server" }

// Not authenticated
{ message: "Authentication required" }
```

## Testing

### Upload Test
```bash
# Using curl
curl -X POST http://localhost:5000/api/resources/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/file.pdf" \
  -F "title=Test Document" \
  -F "course=Mathematics" \
  -F "description=Test upload"
```

### Download Test
```bash
# Using curl
curl -X GET http://localhost:5000/api/resources/download/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output downloaded-file.pdf
```

### Get Resources Test
```bash
# All resources
curl http://localhost:5000/api/resources

# Filtered by course
curl "http://localhost:5000/api/resources?course=Mathematics"

# Filtered by file type
curl "http://localhost:5000/api/resources?fileType=pdf"
```

## Console Logging

### Upload Success
```
✅ File uploaded: lecture-notes.pdf (PDF, 2000.50 KB)
```

### Download Success
```
📥 Download: lecture-notes.pdf by user 507f1f77bcf86cd799439012
```

### Directory Creation
```
✅ Created upload directory: C:\...\backend\uploads\resources
✅ Upload directory exists: C:\...\backend\uploads\resources
```

## Performance Optimization

### File Streaming
- Uses `fs.createReadStream()` for efficient large file downloads
- No memory buffering of entire file
- Supports partial content (future enhancement)

### Database Indexing
Recommended indexes:
```javascript
resourceSchema.index({ course: 1 });
resourceSchema.index({ fileType: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ createdAt: -1 });
```

## Monitoring

### Track Upload Activity
```javascript
// Get upload statistics
const stats = await Resource.aggregate([
  {
    $group: {
      _id: "$fileType",
      count: { $sum: 1 },
      totalSize: { $sum: "$fileSize" }
    }
  }
]);
```

### Track Download Activity
```javascript
// Most downloaded files
const popular = await Resource.find()
  .sort({ downloads: -1 })
  .limit(10);
```

## Future Enhancements

### Planned Features
- [ ] File preview for PDFs and images
- [ ] Thumbnail generation for images
- [ ] Virus scanning integration
- [ ] Cloud storage (AWS S3, Azure Blob)
- [ ] File versioning
- [ ] Bulk upload
- [ ] Advanced search and filtering
- [ ] File sharing links
- [ ] Access control per file

## Troubleshooting

### Issue: Upload directory not found
**Solution**: Restart server (auto-creates directory)

### Issue: Download returns 404
**Solution**: Check file exists in `uploads/resources/`

### Issue: Large file upload fails
**Solution**: Increase multer size limit in middleware

### Issue: Wrong MIME type
**Solution**: Check file extension mapping in `getFileTypeCategory()`

## Summary

✅ **Multi-format Support**: PDF, DOCX, PPTX, images, archives  
✅ **Complete Metadata**: File type, size, extension, MIME type  
✅ **Download Tracking**: Counts downloads per file  
✅ **Streaming**: Efficient large file handling  
✅ **Security**: JWT authentication, file validation  
✅ **Categorization**: Course and department organization  
✅ **Real-time Progress**: Upload progress tracking  
✅ **Error Handling**: Comprehensive error messages  

The file upload and download system is production-ready! 📁✨

# Upload Directory Fix

## Problem
File uploads were failing with error:
```
Error: ENOENT: no such file or directory, open 'C:\MERN Stack\Murti-Guutoo-Student-Association\backend\uploads\resources\1762128001703-198929913.pdf'
```

**Root Cause**: The `uploads/resources` directory didn't exist when trying to save uploaded files.

## Solution Applied

### 1. Enhanced Upload Middleware (`middleware/uploadResource.js`)

**Added double-layer directory creation:**

#### Layer 1: Module Import Time
```javascript
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`✅ Created upload directory: ${uploadDir}`);
  } else {
    console.log(`✅ Upload directory exists: ${uploadDir}`);
  }
} catch (error) {
  console.error(`❌ Failed to create upload directory: ${error.message}`);
  throw error;
}
```

#### Layer 2: Upload Time (Fallback)
```javascript
destination(req, file, cb) {
  // Ensure directory exists before saving file
  if (!fs.existsSync(uploadDir)) {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`✅ Created upload directory on-demand: ${uploadDir}`);
    } catch (error) {
      console.error(`❌ Failed to create directory: ${error.message}`);
      return cb(error);
    }
  }
  cb(null, uploadDir);
}
```

### 2. Setup Script (`setup-uploads.js`)

Created a manual setup script to create all necessary directories:

```javascript
const directories = [
  'uploads',
  'uploads/resources',
  'uploads/profiles',
  'uploads/temp'
];
```

## How to Fix

### Option 1: Restart Backend Server (Automatic)

The enhanced middleware will automatically create directories when the server starts:

```bash
cd backend
node server.js
```

**Expected Output:**
```
✅ Upload directory exists: C:\MERN Stack\Murti-Guutoo-Student-Association\backend\uploads\resources
🚀 Server running on port 5000
✅ MongoDB connected
```

### Option 2: Run Setup Script (Manual)

If automatic creation fails, run the setup script:

```bash
cd backend
node setup-uploads.js
```

**Expected Output:**
```
📁 Creating upload directories...

✅ Created: C:\MERN Stack\Murti-Guutoo-Student-Association\backend\uploads
✅ Created: C:\MERN Stack\Murti-Guutoo-Student-Association\backend\uploads\resources
✅ Created: C:\MERN Stack\Murti-Guutoo-Student-Association\backend\uploads\profiles
✅ Created: C:\MERN Stack\Murti-Guutoo-Student-Association\backend\uploads\temp

✅ Upload directories setup complete!
```

### Option 3: Manual Creation (Windows)

Create directories manually using Command Prompt:

```cmd
cd backend
mkdir uploads
mkdir uploads\resources
mkdir uploads\profiles
mkdir uploads\temp
```

Or using PowerShell:

```powershell
cd backend
New-Item -ItemType Directory -Force -Path uploads\resources
New-Item -ItemType Directory -Force -Path uploads\profiles
New-Item -ItemType Directory -Force -Path uploads\temp
```

## Directory Structure

After setup, your backend should have:

```
backend/
├── uploads/
│   ├── resources/          ← PDF, DOCX, PPTX files
│   ├── profiles/           ← Profile pictures (future)
│   └── temp/               ← Temporary uploads (future)
├── middleware/
│   └── uploadResource.js   ← Enhanced with auto-creation
├── setup-uploads.js        ← Setup script
└── server.js
```

## Testing Upload

### 1. Restart Backend
```bash
cd backend
node server.js
```

### 2. Check Console Output
You should see:
```
✅ Upload directory exists: [path]
🚀 Server running on port 5000
✅ MongoDB connected
```

### 3. Test File Upload
1. Go to Resources page in frontend
2. Select a file (PDF, DOCX, etc.)
3. Choose a category
4. Click "Upload Resource"
5. File should upload successfully

### 4. Verify File Saved
Check the directory:
```bash
cd backend/uploads/resources
dir  # Windows CMD
ls   # PowerShell/Git Bash
```

You should see files like:
```
1762128001703-198929913.pdf
1762128007745-571892905.pdf
```

## Error Handling

### If Directory Creation Fails

**Check Permissions:**
```bash
# Windows - Run as Administrator if needed
# Or check folder permissions in Properties
```

**Check Disk Space:**
```bash
# Ensure you have enough disk space
```

**Check Path:**
```bash
# Verify the path doesn't have special characters
# Current working directory should be 'backend'
```

### If Upload Still Fails

**Check Console for Errors:**
```
❌ Failed to create upload directory: [error message]
```

**Common Issues:**
1. **Permission Denied**: Run terminal as Administrator
2. **Path Too Long**: Move project to shorter path
3. **Disk Full**: Free up disk space
4. **Antivirus**: Temporarily disable or add exception

## Production Deployment

For production, ensure upload directories are created during deployment:

### Docker
```dockerfile
RUN mkdir -p uploads/resources uploads/profiles uploads/temp
```

### Heroku/Cloud
```bash
# Add to package.json scripts
"postinstall": "node setup-uploads.js"
```

### Manual Deployment
```bash
ssh user@server
cd /path/to/backend
node setup-uploads.js
```

## Security Considerations

### .gitignore
Ensure uploads are not committed to git:

```gitignore
# Uploads
uploads/
!uploads/.gitkeep
```

### File Permissions
Set appropriate permissions (Linux/Mac):
```bash
chmod 755 uploads
chmod 755 uploads/resources
```

### File Size Limits
Already configured in multer (30MB max)

## Monitoring

### Check Upload Directory Size
```bash
# Windows
dir uploads\resources

# Linux/Mac
du -sh uploads/resources
```

### Clean Old Files (Optional)
Create a cleanup script if needed:
```javascript
// cleanup-old-uploads.js
const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
// Delete files older than maxAge
```

## Summary

✅ **Fixed**: Enhanced upload middleware with automatic directory creation  
✅ **Added**: Setup script for manual directory creation  
✅ **Added**: Error handling and logging  
✅ **Added**: Fallback directory creation at upload time  

**Next Steps:**
1. Restart backend server
2. Check console for directory creation confirmation
3. Test file upload from frontend
4. Verify files are saved in `uploads/resources/`

The upload directory issue is now fully resolved with multiple layers of protection! 📁✨

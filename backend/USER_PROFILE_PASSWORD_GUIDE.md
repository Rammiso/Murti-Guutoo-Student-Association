# User Profile & Password Management Guide

## Overview
Complete user profile management system with profile picture upload, profile updates, and password change functionality.

## Features Implemented

### 1. Profile Picture Upload
- ✅ Upload profile pictures (JPEG, PNG, GIF)
- ✅ Auto-delete old profile picture when uploading new one
- ✅ 5MB file size limit
- ✅ Unique filename generation (userId-timestamp.ext)
- ✅ Auto-create upload directory

### 2. Profile Updates
- ✅ Update personal information (name, phone, gender)
- ✅ Update academic information (zone, woreda, year, college, department)
- ✅ Partial updates supported (only send changed fields)

### 3. Password Change
- ✅ Verify current password before change
- ✅ Password strength validation (min 6 characters)
- ✅ Confirm password matching
- ✅ Secure password hashing with bcrypt

### 4. Profile Picture Management
- ✅ Delete profile picture
- ✅ Get current user profile
- ✅ Profile picture served via static route

## Backend API Endpoints

### 1. Upload Profile Picture
```
POST /api/user/upload-profile
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```javascript
{
  profilePic: File  // Image file (JPEG, PNG, GIF)
}
```

**Response (200):**
```json
{
  "message": "Profile picture updated successfully",
  "profilePicUrl": "/uploads/profiles/507f1f77bcf86cd799439012-1730595600000.jpg",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "profilePicUrl": "/uploads/profiles/507f1f77bcf86cd799439012-1730595600000.jpg"
  }
}
```

**Errors:**
- `400`: No file uploaded
- `400`: Only image files allowed
- `400`: File size exceeds 5MB
- `404`: User not found

### 2. Get Current User Profile
```
GET /api/user/me
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "email": "john@example.com",
  "fname": "John",
  "lname": "Doe",
  "mname": "",
  "phone": "0912345678",
  "gender": "Male",
  "zone": "West Hararghe",
  "woreda": "Chiro",
  "year": "Freshman",
  "college": "Computing",
  "department": "Software Engineering",
  "role": "student",
  "profilePicUrl": "/uploads/profiles/507f1f77bcf86cd799439012-1730595600000.jpg",
  "isActive": true,
  "createdAt": "2025-11-03T00:00:00.000Z",
  "updatedAt": "2025-11-03T00:00:00.000Z"
}
```

### 3. Update Profile
```
PUT /api/user/update-profile
Headers: Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fname": "John",
  "lname": "Doe",
  "mname": "Smith",
  "phone": "0912345678",
  "gender": "Male",
  "zone": "West Hararghe",
  "woreda": "Chiro",
  "year": "2nd",
  "college": "Computing",
  "department": "Software Engineering"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "fname": "John",
    "lname": "Doe",
    "mname": "Smith",
    "phone": "0912345678",
    "email": "john@example.com",
    "gender": "Male",
    "zone": "West Hararghe",
    "woreda": "Chiro",
    "year": "2nd",
    "college": "Computing",
    "department": "Software Engineering",
    "profilePicUrl": "/uploads/profiles/..."
  }
}
```

### 4. Change Password
```
PUT /api/user/change-password
Headers: Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Errors:**
- `400`: All fields are required
- `400`: New passwords do not match
- `400`: Password must be at least 6 characters long
- `400`: Current password is incorrect
- `404`: User not found

### 5. Delete Profile Picture
```
DELETE /api/user/delete-profile-pic
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Profile picture deleted successfully"
}
```

## Frontend Integration

### Upload Profile Picture
```javascript
import { uploadProfilePicture } from "../api/userService";

const handleUpload = async (file) => {
  const result = await uploadProfilePicture(file);
  
  if (result.success) {
    console.log("Profile picture URL:", result.profilePicUrl);
    // Update UI with new profile picture
  } else {
    console.error("Upload failed:", result.message);
  }
};

// Usage with file input
<input 
  type="file" 
  accept="image/*" 
  onChange={(e) => handleUpload(e.target.files[0])} 
/>
```

### Get User Profile
```javascript
import { getCurrentUserProfile } from "../api/userService";

const loadProfile = async () => {
  const result = await getCurrentUserProfile();
  
  if (result.success) {
    console.log("User profile:", result.user);
    // Display profile data
  }
};
```

### Update Profile
```javascript
import { updateUserProfile } from "../api/userService";

const handleUpdate = async (profileData) => {
  const result = await updateUserProfile({
    fname: "John",
    lname: "Doe",
    phone: "0912345678",
    year: "2nd"
  });
  
  if (result.success) {
    console.log("Profile updated:", result.user);
  }
};
```

### Change Password
```javascript
import { changePassword } from "../api/userService";

const handlePasswordChange = async () => {
  const result = await changePassword(
    "currentPassword123",
    "newPassword123",
    "newPassword123"
  );
  
  if (result.success) {
    console.log("Password changed successfully");
    // Show success message, maybe logout user
  } else {
    console.error("Password change failed:", result.message);
  }
};
```

### Delete Profile Picture
```javascript
import { deleteProfilePicture } from "../api/userService";

const handleDelete = async () => {
  const result = await deleteProfilePicture();
  
  if (result.success) {
    console.log("Profile picture deleted");
    // Remove profile picture from UI
  }
};
```

## File Storage

### Directory Structure
```
backend/
└── uploads/
    └── profiles/
        ├── 507f1f77bcf86cd799439012-1730595600000.jpg
        ├── 507f1f77bcf86cd799439013-1730595700000.png
        └── 507f1f77bcf86cd799439014-1730595800000.gif
```

### Filename Format
```
{userId}-{timestamp}.{extension}
Example: 507f1f77bcf86cd799439012-1730595600000.jpg
```

### Accessing Profile Pictures
Profile pictures are served via Express static middleware:
```
http://localhost:5000/uploads/profiles/507f1f77bcf86cd799439012-1730595600000.jpg
```

## Validation Rules

### Profile Picture
- **File Types**: JPEG, PNG, GIF
- **Max Size**: 5MB
- **Dimensions**: No restriction (can be added)

### Password
- **Minimum Length**: 6 characters
- **Must Match**: New password and confirm password must match
- **Current Password**: Must be correct

### Profile Fields
- **fname**: Required (2-50 characters)
- **lname**: Optional (2-50 characters)
- **mname**: Optional (max 50 characters)
- **phone**: Optional (10-15 digits)
- **gender**: Male or Female
- **zone**: West Hararghe or East Hararghe
- **woreda**: Required
- **year**: Freshman, 2nd, 3rd, 4th, 5th
- **college**: Required
- **department**: Required

## Security Features

### Authentication
- ✅ All endpoints require JWT authentication
- ✅ User can only access/modify their own profile
- ✅ Token verified via `protect` middleware

### Password Security
- ✅ Current password verification before change
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ Never return password in API responses

### File Security
- ✅ File type validation (images only)
- ✅ File size limits (5MB)
- ✅ Unique filenames prevent overwrites
- ✅ Old files deleted when uploading new ones

## Error Handling

### Upload Errors
```javascript
// No file selected
{ message: "No file uploaded" }

// Invalid file type
{ message: "Only image files (JPEG, PNG, GIF) are allowed!" }

// File too large
{ message: "File size exceeds 5MB limit" }

// User not found
{ message: "User not found" }
```

### Password Change Errors
```javascript
// Missing fields
{ message: "All fields are required" }

// Passwords don't match
{ message: "New passwords do not match" }

// Password too short
{ message: "Password must be at least 6 characters long" }

// Wrong current password
{ message: "Current password is incorrect" }
```

## Console Logging

### Profile Picture Upload
```
✅ Profile picture updated for user: john@example.com
```

### Old Picture Deletion
```
🗑️ Deleted old profile picture: C:\...\uploads\profiles\old-file.jpg
```

### Password Change
```
✅ Password changed for user: john@example.com
```

### Profile Update
```
✅ Profile updated for user: john@example.com
```

## Testing

### Upload Profile Picture (curl)
```bash
curl -X POST http://localhost:5000/api/user/upload-profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "profilePic=@/path/to/image.jpg"
```

### Change Password (curl)
```bash
curl -X PUT http://localhost:5000/api/user/change-password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldpass123",
    "newPassword": "newpass123",
    "confirmPassword": "newpass123"
  }'
```

### Update Profile (curl)
```bash
curl -X PUT http://localhost:5000/api/user/update-profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fname": "John",
    "phone": "0912345678",
    "year": "2nd"
  }'
```

## Frontend Components Needed

### Profile Picture Upload Component
```jsx
import { useState } from 'react';
import { uploadProfilePicture } from '../api/userService';

const ProfilePictureUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    setPreview(URL.createObjectURL(file));

    // Upload
    setUploading(true);
    const result = await uploadProfilePicture(file);
    setUploading(false);

    if (result.success) {
      // Update user context/state
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {preview && <img src={preview} alt="Preview" />}
      {uploading && <p>Uploading...</p>}
    </div>
  );
};
```

### Change Password Component
```jsx
import { useState } from 'react';
import { changePassword } from '../api/userService';

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const result = await changePassword(
      form.currentPassword,
      form.newPassword,
      form.confirmPassword
    );

    if (result.success) {
      setSuccess(true);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setError(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Current Password"
        value={form.currentPassword}
        onChange={(e) => setForm({...form, currentPassword: e.target.value})}
      />
      <input
        type="password"
        placeholder="New Password"
        value={form.newPassword}
        onChange={(e) => setForm({...form, newPassword: e.target.value})}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
      />
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Password changed successfully!</p>}
      <button type="submit">Change Password</button>
    </form>
  );
};
```

## Summary

✅ **Profile Picture Upload**: 5MB limit, JPEG/PNG/GIF support  
✅ **Profile Updates**: Partial updates, all user fields supported  
✅ **Password Change**: Secure with current password verification  
✅ **File Management**: Auto-delete old pictures, unique filenames  
✅ **Security**: JWT authentication, password hashing, file validation  
✅ **Error Handling**: Comprehensive error messages  
✅ **Frontend Service**: Ready-to-use API functions  

The user profile and password management system is production-ready! 👤🔒

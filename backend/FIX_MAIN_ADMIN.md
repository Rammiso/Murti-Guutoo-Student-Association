# 🔧 Fix Main Admin Issue

## Problem
When trying to promote users to admin, you get the error: **"Failed to update role. Please try again."**

## Root Cause
The admin user in the database doesn't have `mainAdmin: true` set. Only users with `mainAdmin: true` can promote/demote other users.

## Solution Options

### Option 1: Use the Script (Recommended)

Run the provided script to set your admin user as main admin:

```bash
cd backend
node scripts/setMainAdmin.js your-admin-email@example.com
```

**Example:**
```bash
node scripts/setMainAdmin.js admin@gmail.com
```

**Expected Output:**
```
✅ Connected to MongoDB
✅ User updated successfully:
{
  email: 'admin@gmail.com',
  role: 'admin',
  mainAdmin: true,
  fname: 'Admin',
  lname: 'User'
}
```

### Option 2: Update Manually in MongoDB

If you prefer to update manually:

1. **Using MongoDB Compass:**
   - Connect to your database
   - Navigate to the `users` collection
   - Find your admin user
   - Edit the document and add/update: `"mainAdmin": true`
   - Save changes

2. **Using MongoDB Shell:**
   ```javascript
   use your_database_name
   db.users.updateOne(
     { email: "your-admin-email@example.com" },
     { $set: { mainAdmin: true, role: "admin" } }
   )
   ```

### Option 3: Check Your Current Status

First, check if you're already a main admin:

1. **Restart your backend server** (to load the new route)
2. **Make a GET request** to check your status:
   ```bash
   GET http://localhost:5000/api/admin/me
   Authorization: Bearer YOUR_TOKEN
   ```

3. **Or use the browser console** on the Admin Dashboard:
   ```javascript
   fetch('http://localhost:5000/api/admin/me', {
     headers: {
       'Authorization': 'Bearer ' + localStorage.getItem('token')
     }
   })
   .then(r => r.json())
   .then(console.log)
   ```

**Expected Response:**
```json
{
  "email": "admin@gmail.com",
  "role": "admin",
  "mainAdmin": true,
  "fname": "Admin",
  "lname": "User"
}
```

If `mainAdmin` is `false` or missing, use Option 1 or 2 to fix it.

## Verification Steps

After setting main admin:

1. **Restart backend server**
2. **Login as admin**
3. **Try to promote a user**
4. **Check backend console** for debug logs:
   ```
   🔍 Role update request from: {
     email: 'admin@gmail.com',
     role: 'admin',
     mainAdmin: true,
     userId: '...'
   }
   ✅ Main admin verified: admin@gmail.com
   ✅ User user@example.com role updated to admin
   ```

## Troubleshooting

### Issue: "Only main admin can modify user roles"
**Cause:** Your user doesn't have `mainAdmin: true`
**Fix:** Run the script or update manually (see above)

### Issue: Script says "User not found"
**Cause:** Email doesn't match any user in database
**Fix:** 
- Check the email spelling
- Ensure the user exists in the database
- Email is case-insensitive but must match exactly

### Issue: "Cannot read property 'mainAdmin' of undefined"
**Cause:** Token is invalid or user was deleted
**Fix:** 
- Logout and login again
- Check if user exists in database

## Security Note

⚠️ **Important:** Only ONE user should have `mainAdmin: true`. This is the super admin who can:
- Promote users to admin
- Demote admins to students
- Cannot be demoted themselves

Regular admins (with `role: "admin"` but `mainAdmin: false`) can:
- View all users
- Delete users
- Manage resources
- But CANNOT change user roles

## Additional Commands

### List all admins:
```javascript
db.users.find({ role: "admin" })
```

### List all main admins:
```javascript
db.users.find({ mainAdmin: true })
```

### Remove main admin status:
```javascript
db.users.updateOne(
  { email: "old-admin@example.com" },
  { $set: { mainAdmin: false } }
)
```

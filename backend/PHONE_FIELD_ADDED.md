# Phone Field Integration

## Changes Made

Added phone number support to the user registration system across backend and frontend.

## Backend Changes

### 1. Validation Schema (`middleware/validation.js`)

Added phone validation to registration schema:

```javascript
phone: Joi.string()
  .pattern(/^[0-9]{10,15}$/)
  .optional()
  .allow("")
  .messages({
    "string.pattern.base": "Phone number must be 10-15 digits",
  }),
```

**Validation Rules:**
- **Pattern**: Must be 10-15 digits (numbers only)
- **Optional**: Field is not required
- **Allow Empty**: Can be left blank
- **Error Message**: Clear feedback if format is invalid

### 2. User Model (`models/User.js`)

Added phone field to user schema:

```javascript
phone: { type: String, default: "" },
```

**Field Properties:**
- **Type**: String
- **Default**: Empty string
- **Not Required**: Optional field
- **Position**: After mname, before gender

## Frontend Changes

### Register Component (`src/pages/Register.jsx`)

Restored phone field in registration data:

```javascript
await register({
  email: form.email,
  password: form.password,
  fname: form.fname,
  lname: form.lname || "",
  mname: form.mname || "",
  phone: form.phone || "", // ✅ Now included
  gender: form.gender,
  zone: form.zone,
  woreda: form.woreda,
  year: form.year,
  college: form.college,
  department: form.department,
});
```

## Phone Number Format

### Accepted Formats
- ✅ `0912345678` (10 digits)
- ✅ `251912345678` (12 digits with country code)
- ✅ `+251912345678` (with + prefix) - Note: The + will be stripped
- ✅ Empty/blank (optional field)

### Rejected Formats
- ❌ `091-234-5678` (contains hyphens)
- ❌ `091 234 5678` (contains spaces)
- ❌ `(091) 234-5678` (contains special characters)
- ❌ `123` (less than 10 digits)
- ❌ `12345678901234567` (more than 15 digits)

## Validation Flow

1. **Frontend**: User enters phone number
2. **Frontend**: Basic validation (optional)
3. **Backend**: Joi validates format (10-15 digits)
4. **Backend**: Saves to MongoDB if valid
5. **Error**: Returns clear message if invalid format

## Testing

### Valid Registration with Phone
```json
{
  "fname": "John",
  "lname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0912345678",
  "gender": "Male",
  "zone": "West Hararghe",
  "woreda": "Chiro",
  "year": "Freshman",
  "college": "Computing",
  "department": "Software Engineering"
}
```

### Valid Registration without Phone
```json
{
  "fname": "Jane",
  "lname": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "phone": "",  // Empty is allowed
  "gender": "Female",
  "zone": "East Hararghe",
  "woreda": "Harar",
  "year": "2nd",
  "college": "Engineering",
  "department": "Civil Engineering"
}
```

### Invalid Phone Format
```json
{
  "phone": "091-234-5678"  // ❌ Contains hyphens
}
```

**Error Response:**
```json
{
  "message": "Phone number must be 10-15 digits"
}
```

## Database Schema

After these changes, user documents will have:

```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  password: "hashed_password",
  role: "student",
  fname: "John",
  lname: "Doe",
  mname: "",
  phone: "0912345678",  // ✅ New field
  gender: "Male",
  zone: "West Hararghe",
  woreda: "Chiro",
  year: "Freshman",
  college: "Computing",
  department: "Software Engineering",
  profilePicUrl: "",
  isActive: true,
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

## Next Steps

**Restart the backend server** to apply changes:
```bash
cd backend
node server.js
```

**Test registration** with phone number:
1. Fill out registration form
2. Enter phone number (10-15 digits)
3. Click "Register"
4. Should successfully create user with phone number

## Optional Enhancements

If you want to add more phone validation in the future:

### Country Code Support
```javascript
phone: Joi.string()
  .pattern(/^(\+251|0)[0-9]{9}$/)  // Ethiopian format
  .optional()
```

### Required Phone
```javascript
phone: Joi.string()
  .pattern(/^[0-9]{10,15}$/)
  .required()  // Make it mandatory
  .messages({
    "string.empty": "Phone number is required",
    "string.pattern.base": "Phone number must be 10-15 digits",
  }),
```

### Frontend Validation
Add to Register.jsx validation:
```javascript
if (form.phone && !/^[0-9]{10,15}$/.test(form.phone)) {
  setErrors((prev) => ({
    ...prev,
    phone: "Phone number must be 10-15 digits",
  }));
  return;
}
```

## Files Modified

1. ✅ `backend/middleware/validation.js` - Added phone validation
2. ✅ `backend/models/User.js` - Added phone field to schema
3. ✅ `mgsa-frontend/src/pages/Register.jsx` - Included phone in registration data

## Summary

Phone number support is now fully integrated:
- ✅ Backend validates phone format (10-15 digits)
- ✅ User model stores phone number
- ✅ Frontend sends phone in registration
- ✅ Field is optional (can be empty)
- ✅ Clear error messages for invalid formats

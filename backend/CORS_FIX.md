# CORS Configuration Fix

## Problem
The application was experiencing CORS errors when the frontend tried to make API requests to the backend:

```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/register' from origin 'http://localhost:5173' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' 
when the request's credentials mode is 'include'.
```

## Root Cause
- Frontend Axios instance configured with `withCredentials: true`
- Backend CORS using default wildcard `*` for origin
- **CORS Policy**: When credentials are included, the origin cannot be `*` - it must be specific

## Solution Applied

### Backend Changes (`server.js`)

**Before:**
```javascript
app.use(cors());
```

**After:**
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Configuration Details

- **origin**: `'http://localhost:5173'` - Specific frontend URL (Vite dev server)
- **credentials**: `true` - Allows cookies and authorization headers
- **methods**: All HTTP methods needed for REST API
- **allowedHeaders**: Content-Type for JSON, Authorization for JWT tokens

## Additional Fix

### Package.json Type Field
Fixed the module type warning by updating `package.json`:

**Before:**
```json
"type": ".mjs"
```

**After:**
```json
"type": "module"
```

This eliminates the Node.js warning about module type detection.

## Testing Steps

1. **Restart the backend server:**
   ```bash
   cd backend
   node server.js
   ```

2. **Verify server starts without warnings:**
   ```
   🚀 Server running on port 5000
   ✅ MongoDB connected
   ```

3. **Test registration from frontend:**
   - Fill out registration form
   - Click "Register" button
   - Should successfully create user and auto-login

4. **Test login:**
   - Enter credentials
   - Click "Login" button
   - Should successfully authenticate and redirect

## Production Considerations

For production deployment, update the CORS origin:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Add to `.env`:
```
FRONTEND_URL=https://yourdomain.com
```

## Why This Works

1. **Specific Origin**: Browser allows credentials when origin is explicitly set
2. **Credentials Flag**: Tells browser to include cookies/auth headers
3. **Proper Headers**: Allows Content-Type and Authorization headers needed for API
4. **All Methods**: Supports full REST API operations

## Related Files Modified

- `backend/server.js` - CORS configuration
- `backend/package.json` - Module type specification

## Frontend Configuration (No Changes Needed)

The frontend Axios configuration remains the same:
```javascript
// src/api/axios.js
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // This now works with backend CORS
});
```

## Common CORS Errors and Solutions

### Error: "Origin not allowed"
**Solution**: Verify frontend URL matches CORS origin exactly (including port)

### Error: "Credentials not allowed"
**Solution**: Ensure both frontend and backend have credentials enabled

### Error: "Method not allowed"
**Solution**: Add the HTTP method to the `methods` array in CORS config

### Error: "Header not allowed"
**Solution**: Add the header name to `allowedHeaders` array

## Verification Checklist

- [x] Backend CORS configured with specific origin
- [x] Credentials enabled in CORS config
- [x] All required methods allowed
- [x] Content-Type and Authorization headers allowed
- [x] Module type specified in package.json
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test protected routes with JWT
- [ ] Test file upload with credentials

## Next Steps

After restarting the backend server:
1. Try registering a new user
2. Verify JWT token is stored in localStorage
3. Test protected routes
4. Test file uploads
5. Verify all API calls work without CORS errors

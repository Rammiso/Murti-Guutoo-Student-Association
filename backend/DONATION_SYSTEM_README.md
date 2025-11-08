# 💰 MGSA Donation System - Complete Integration Guide

## 📋 Overview
Complete donation/payment management system for Murti Guutoo Students Association with:
- Public donation submission with Cloudinary screenshot upload
- Admin dashboard for payment verification/rejection
- Real-time statistics and filtering
- Secure JWT authentication

---

## 🗂️ File Structure

```
backend/
├── models/
│   └── Payment.js          # Payment schema with methods & statics
├── routes/
│   └── payments.js         # All payment endpoints
├── middleware/
│   └── authMiddleware.js   # protect & isAdmin middleware
├── config/
│   └── cloudinary.js       # Cloudinary configuration
└── server.js               # Main server (updated)
```

---

## 🚀 API Endpoints

### **PUBLIC ROUTES**

#### 1. Submit Payment
```http
POST /api/payments/submit
Content-Type: application/json

{
  "fullName": "John Doe",
  "description": "Donation for academic support",
  "screenshotUrl": "data:image/png;base64,...",  // Base64 or URL
  "amount": 500,                                  // Optional
  "paymentType": "donation"                       // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment submitted successfully! We will verify it soon.",
  "data": {
    "id": "64abc123...",
    "fullName": "John Doe",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### **ADMIN ROUTES** (Require `Authorization: Bearer <token>`)

#### 2. Get All Payments (with filters & pagination)
```http
GET /api/payments?status=pending&page=1&limit=20&search=john
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `status`: pending | verified | rejected | all
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search by name or description
- `sortBy`: Field to sort by (default: createdAt)
- `order`: asc | desc (default: desc)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 3,
    "limit": 20
  }
}
```

#### 3. Get Payment Statistics
```http
GET /api/payments/stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPending": 12,
    "totalVerified": 28,
    "totalRejected": 5,
    "total": 45,
    "totalAmountVerified": 15000,
    "todaySubmissions": 3,
    "recentPayments": [...]
  }
}
```

#### 4. Get Single Payment
```http
GET /api/payments/:id
Authorization: Bearer <admin_token>
```

#### 5. Verify Payment
```http
PUT /api/payments/:id/verify
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "notes": "Verified via bank statement"  // Optional
}
```

#### 6. Reject Payment
```http
PUT /api/payments/:id/reject
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reason": "Screenshot unclear, please resubmit"  // Required
}
```

#### 7. Delete Payment
```http
DELETE /api/payments/:id
Authorization: Bearer <admin_token>
```
*Also deletes screenshot from Cloudinary*

#### 8. Update Payment Notes
```http
PUT /api/payments/:id/notes
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "notes": "Contacted donor for clarification"
}
```

---

## 🔧 Environment Variables

Add to your `.env` file:

```env
# Cloudinary (Required for screenshot uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT (Already configured)
JWT_SECRET=your_jwt_secret

# MongoDB (Already configured)
MONGODB_URI=your_mongodb_uri

# Server
PORT=5000
```

---

## 📦 Installation Steps

### 1. Backend Setup

```bash
cd backend

# Install dependencies (if not already installed)
npm install cloudinary

# Verify .env has Cloudinary credentials
# Start server
npm run dev
```

### 2. Frontend Setup

Add to `mgsa-frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
# For production: https://your-backend.onrender.com
```

### 3. Test the Integration

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd mgsa-frontend
npm run dev
```

Visit: `http://localhost:5174/payment`

---

## 🧪 Testing Endpoints

### Using Postman/Thunder Client:

**1. Submit Payment (Public)**
```bash
POST http://localhost:5000/api/payments/submit
Content-Type: application/json

{
  "fullName": "Test User",
  "description": "Test donation",
  "screenshotUrl": "https://via.placeholder.com/600",
  "amount": 100
}
```

**2. Get All Payments (Admin)**
```bash
GET http://localhost:5000/api/payments?status=pending
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**3. Verify Payment (Admin)**
```bash
PUT http://localhost:5000/api/payments/PAYMENT_ID/verify
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "notes": "Verified successfully"
}
```

---

## 🎨 Frontend Integration

The Donation page (`/mgsa-frontend/src/pages/Donation.jsx`) is already updated to:
- ✅ Use environment variable for API URL
- ✅ Submit to `/api/payments/submit`
- ✅ Handle success/error responses
- ✅ Show success modal on submission
- ✅ Upload screenshots as base64

---

## 🛡️ Security Features

1. **JWT Authentication**: All admin routes protected
2. **Role-Based Access**: Only admins can verify/reject
3. **Input Validation**: Required fields checked
4. **Cloudinary Upload**: Secure image storage
5. **Error Handling**: Comprehensive error messages
6. **CORS Protection**: Only allowed origins

---

## 📊 Database Schema

```javascript
Payment {
  fullName: String (required)
  description: String (required)
  amount: Number (default: 0)
  screenshotUrl: String (required)
  screenshotPublicId: String
  bankAccount: String (default: "1000722101228")
  accountHolder: String
  paymentType: String (enum: donation|membership|event|other)
  status: String (enum: pending|verified|rejected)
  verifiedBy: ObjectId (ref: User)
  verifiedAt: Date
  rejectionReason: String
  notes: String
  submittedBy: ObjectId (ref: User)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}

Indexes:
- { status: 1, createdAt: -1 }
- { fullName: 1 }
- { createdAt: -1 }
```

---

## 🔍 Admin Dashboard Integration

### Recommended Dashboard Features:

1. **Donations Overview Card**
```jsx
// Fetch stats
const { data } = await axios.get('/api/payments/stats', {
  headers: { Authorization: `Bearer ${token}` }
});

// Display:
- Total Pending: {data.totalPending}
- Total Verified: {data.totalVerified}
- Today's Submissions: {data.todaySubmissions}
```

2. **Donations Table**
```jsx
// Fetch payments with filters
const { data } = await axios.get(
  `/api/payments?status=${filter}&page=${page}`,
  { headers: { Authorization: `Bearer ${token}` } }
);

// Show table with:
- Name, Description, Amount, Status, Date
- Actions: View, Verify, Reject, Delete
```

3. **Payment Detail Modal**
```jsx
// Fetch single payment
const { data } = await axios.get(`/api/payments/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Show:
- Full details
- Screenshot (full size)
- Verify/Reject buttons
- Notes field
```

---

## 🐛 Troubleshooting

### Issue: "Failed to upload screenshot"
**Solution:** Check Cloudinary credentials in `.env`

### Issue: "Unauthorized"
**Solution:** Ensure admin token is valid and user has admin role

### Issue: "CORS error"
**Solution:** Add frontend URL to `allowedOrigins` in `server.js`

### Issue: "Payment not found"
**Solution:** Verify MongoDB connection and Payment model is imported

---

## 📈 Next Steps

### Optional Enhancements:

1. **Email Notifications**
   - Send email to admin on new submission
   - Send confirmation email to donor on verification

2. **SMS Notifications**
   - Integrate Twilio for SMS alerts

3. **Export to Excel**
   - Add endpoint to export payments as CSV/Excel

4. **Payment Analytics**
   - Monthly donation trends
   - Top donors
   - Category breakdown

5. **Automated Verification**
   - OCR for screenshot text extraction
   - Auto-verify if amount matches

---

## 📞 Support

For issues or questions:
- Email: finance.mgsa@gmail.com
- GitHub: [Your Repo]

---

## ✅ Checklist

- [x] Payment model created
- [x] Payment routes implemented
- [x] Cloudinary integration
- [x] Admin authentication
- [x] Frontend connected
- [x] Error handling
- [x] Documentation complete

**Status: ✅ PRODUCTION READY**

---

*Last Updated: November 2024*
*MGSA Development Team*

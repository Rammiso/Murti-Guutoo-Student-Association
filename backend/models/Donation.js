/**
 * BACKEND EXAMPLE FOR PAYMENT UI
 * 
 * This is what you need on the server side to handle
 * the payment form submissions from PaymentForm.tsx
 * 
 * Tech Stack: Node.js + Express + MongoDB
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Large limit for screenshots
app.use(cors());

// ============================================
// DATABASE MODEL
// ============================================

const paymentSchema = new mongoose.Schema({
  // User Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  
  // Screenshot (base64 or URL)
  screenshotUrl: {
    type: String,
    required: [true, 'Screenshot is required']
  },
  
  // Bank Account Info
  bankAccount: {
    type: String,
    default: '1000722101228'
  },
  
  accountHolder: {
    type: String,
    default: 'Farida Mohammed and Murata Hassan'
  },
  
  // Payment Type
  paymentType: {
    type: String,
    default: 'payment'
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  
  // Verification Info
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  verifiedAt: {
    type: Date
  },
  
  rejectionReason: {
    type: String
  },
  
  // Notes
  notes: {
    type: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for faster queries
paymentSchema.index({ fullName: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

// ============================================
// API ENDPOINTS
// ============================================

// 1. SUBMIT PAYMENT (Main endpoint - called by frontend)
app.post('/api/v1/payments/submit', async (req, res) => {
  try {
    const { fullName, description, screenshotUrl, paymentType } = req.body;
    
    // Validate required fields
    if (!fullName || !description || !screenshotUrl) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }
    
    // Create payment record
    const payment = await Payment.create({
      fullName,
      description,
      screenshotUrl,
      paymentType: paymentType || 'payment',
      status: 'pending'
    });
    
    // Optional: Send notification (email, Telegram, etc.)
    // await sendNotification(payment);
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'Payment submitted successfully. We will verify it soon.',
      data: payment
    });
    
  } catch (error) {
    console.error('Submit payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
});

// 2. GET ALL PAYMENTS (Admin - to see all submissions)
app.get('/api/v1/payments', async (req, res) => {
  try {
    const { status, search } = req.query;
    
    // Build query
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get payments
    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 3. GET SINGLE PAYMENT (Admin - view details)
app.get('/api/v1/payments/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 4. VERIFY PAYMENT (Admin - approve payment)
app.put('/api/v1/payments/:id/verify', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }
    
    // Update status
    payment.status = 'verified';
    payment.verifiedAt = new Date();
    // payment.verifiedBy = req.user._id; // If you have authentication
    await payment.save();
    
    // Optional: Send confirmation to user
    // await sendConfirmation(payment);
    
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: payment
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 5. REJECT PAYMENT (Admin - reject payment)
app.put('/api/v1/payments/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }
    
    // Update status
    payment.status = 'rejected';
    payment.rejectionReason = reason;
    await payment.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment rejected',
      data: payment
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 6. GET STATISTICS (Admin - dashboard stats)
app.get('/api/v1/payments/stats', async (req, res) => {
  try {
    const totalPending = await Payment.countDocuments({ status: 'pending' });
    const totalVerified = await Payment.countDocuments({ status: 'verified' });
    const totalRejected = await Payment.countDocuments({ status: 'rejected' });
    
    const recentPayments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('fullName description status createdAt');
    
    res.status(200).json({
      success: true,
      data: {
        totalPending,
        totalVerified,
        totalRejected,
        total: totalPending + totalVerified + totalRejected,
        recentPayments
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// DATABASE CONNECTION & SERVER START
// ============================================

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/payment-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Payment Backend running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/v1/payments`);
});

// ============================================
// DEPENDENCIES NEEDED
// ============================================
/*
npm install express mongoose cors

package.json:
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.3",
    "cors": "^2.8.5"
  }
}
*/

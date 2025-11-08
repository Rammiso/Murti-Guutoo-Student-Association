import express from "express";
import Payment from "../models/Payment.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route   POST /api/payments/submit
 * @desc    Submit a new payment with screenshot
 * @access  Public
 */
router.post("/submit", async (req, res) => {
  try {
    const { fullName, description, screenshotUrl, amount, paymentType } =
      req.body;

    // Validate required fields || !screenshotUrl
    if (!fullName || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (fullName, description)",
      });
    }

    // Validate screenshot is base64 or URL
    if (
      !screenshotUrl.startsWith("data:image/") &&
      !screenshotUrl.startsWith("http")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid screenshot format",
      });
    }

    let uploadedScreenshot = {
      secure_url: screenshotUrl,
      public_id: null,
    };

    // Upload to Cloudinary if base64
    if (screenshotUrl.startsWith("data:image/")) {
      try {
        console.log("📤 Uploading screenshot to Cloudinary...");

        uploadedScreenshot = await cloudinary.uploader.upload(screenshotUrl, {
          folder: "mgsa-payments",
          resource_type: "image",
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto:good" },
          ],
        });

        console.log("✅ Screenshot uploaded:", uploadedScreenshot.secure_url);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload screenshot. Please try again.",
          error: uploadError.message,
        });
      }
    }

    // Create payment record
    const payment = await Payment.create({
      fullName,
      description,
      screenshotUrl: uploadedScreenshot.secure_url,
      screenshotPublicId: uploadedScreenshot.public_id,
      amount: amount || 0,
      paymentType: paymentType || "donation",
      submittedBy: req.user?._id, // If user is authenticated
    });

    console.log("✅ Payment submitted:", payment._id);

    // Return success response
    res.status(201).json({
      success: true,
      message: "Payment submitted successfully! We will verify it soon.",
      data: {
        id: payment._id,
        fullName: payment.fullName,
        status: payment.status,
        createdAt: payment.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Submit payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit payment",
      error: error.message,
    });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @route   GET /api/payments
 * @desc    Get all payments with filters and pagination
 * @access  Admin
 */
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build query
    let query = {};

    // if (status && status !== "all") {
    //   query.status = status;
    // }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "desc" ? -1 : 1;

    // Get payments
    const payments = await Payment.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip)
      .populate("verifiedBy", "name email")
      .populate("submittedBy", "name email");

    // Get total count
    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("❌ Get payments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/payments/stats
 * @desc    Get payment statistics
 * @access  Admin
 */
router.get("/stats", protect, isAdmin, async (req, res) => {
  try {
    // Get statistics
    const stats = await Payment.getStats();

    // Get recent payments
    const recentPayments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("fullName description amount createdAt")
      .lean();

    // Get today's submissions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Payment.countDocuments({
      createdAt: { $gte: today },
    });

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        todaySubmissions: todayCount,
        recentPayments,
      },
    });
  } catch (error) {
    console.error("❌ Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/payments/:id
 * @desc    Get single payment details
 * @access  Admin
 */
router.get("/:id", protect, isAdmin, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("verifiedBy", "name email role")
      .populate("submittedBy", "name email");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("❌ Get payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/payments/:id/verify
 * @desc    Verify a payment
 * @access  Admin
 */
// router.put("/:id/verify", protect, isAdmin, async (req, res) => {
//   try {
//     const { notes } = req.body;
//     const payment = await Payment.findById(req.params.id);

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     // if (payment.status === "verified") {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "Payment is already verified",
//     //   });
//     // }

//     // Verify payment
//     await payment.verify(req.user._id);

//     if (notes) {
//       payment.notes = notes;
//       await payment.save();
//     }

//     console.log(`✅ Payment ${payment._id} verified by ${req.user.name}`);

//     res.status(200).json({
//       success: true,
//       message: "Payment verified successfully",
//       data: payment,
//     });
//   } catch (error) {
//     console.error("❌ Verify payment error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to verify payment",
//       error: error.message,
//     });
//   }
// });

/**
 * @route   PUT /api/payments/:id/reject
 * @desc    Reject a payment
 * @access  Admin
 */
// router.put("/:id/reject", protect, isAdmin, async (req, res) => {
//   try {
//     const { reason } = req.body;

//     if (!reason) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide a rejection reason",
//       });
//     }

//     const payment = await Payment.findById(req.params.id);

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     if (payment.status === "rejected") {
//       return res.status(400).json({
//         success: false,
//         message: "Payment is already rejected",
//       });
//     }

//     // Reject payment
//     await payment.reject(reason);

//     console.log(`❌ Payment ${payment._id} rejected by ${req.user.name}`);

//     res.status(200).json({
//       success: true,
//       message: "Payment rejected",
//       data: payment,
//     });
//   } catch (error) {
//     console.error("❌ Reject payment error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to reject payment",
//       error: error.message,
//     });
//   }
// });

/**
 * @route   DELETE /api/payments/:id
 * @desc    Delete a payment (and its screenshot from Cloudinary)
 * @access  Admin
 */
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Delete screenshot from Cloudinary if exists
    if (payment.screenshotPublicId) {
      try {
        await cloudinary.uploader.destroy(payment.screenshotPublicId);
        console.log("🗑️ Screenshot deleted from Cloudinary");
      } catch (cloudinaryError) {
        console.error("⚠️ Failed to delete from Cloudinary:", cloudinaryError);
      }
    }

    // Delete payment from database
    await payment.deleteOne();

    console.log(`🗑️ Payment ${payment._id} deleted by ${req.user.name}`);

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete payment",
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/payments/:id/notes
 * @desc    Update payment notes
 * @access  Admin
 */
router.put("/:id/notes", protect, isAdmin, async (req, res) => {
  try {
    const { notes } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    payment.notes = notes;
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Notes updated successfully",
      data: payment,
    });
  } catch (error) {
    console.error("❌ Update notes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notes",
      error: error.message,
    });
  }
});

export default router;

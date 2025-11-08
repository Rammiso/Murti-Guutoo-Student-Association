import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // User Information
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    // Amount (optional - can be "any amount")
    amount: {
      type: Number,
      default: 0,
    },

    // Screenshot URL (Cloudinary)
    screenshotUrl: {
      type: String,
      required: [true, "Screenshot is required"],
    },

    // Cloudinary Public ID (for deletion if needed)
    screenshotPublicId: {
      type: String,
    },

    // Bank Account Info (for reference)
    bankAccount: {
      type: String,
      default: "1000722101228",
    },

    accountHolder: {
      type: String,
      default: "Farida Mohammed and Murata Hassan",
    },

    // Payment Type
    paymentType: {
      type: String,
      default: "donation",
      enum: ["donation", "membership", "event", "other"],
    },

    // Status
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    // Verification Info
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    verifiedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
    },

    // Admin Notes
    notes: {
      type: String,
    },

    // User who submitted (if authenticated)
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Indexes for faster queries
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ fullName: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ verifiedBy: 1 });

// Virtual for payment age
paymentSchema.virtual("age").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Method to verify payment
paymentSchema.methods.verify = async function (adminId) {
  this.status = "verified";
  this.verifiedBy = adminId;
  this.verifiedAt = new Date();
  return await this.save();
};

// Method to reject payment
paymentSchema.methods.reject = async function (reason) {
  this.status = "rejected";
  this.rejectionReason = reason;
  return await this.save();
};

// Static method to get statistics
paymentSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const result = {
    totalPending: 0,
    totalVerified: 0,
    totalRejected: 0,
    total: 0,
    totalAmountVerified: 0,
  };

  stats.forEach((stat) => {
    if (stat._id === "pending") result.totalPending = stat.count;
    if (stat._id === "verified") {
      result.totalVerified = stat.count;
      result.totalAmountVerified = stat.totalAmount;
    }
    if (stat._id === "rejected") result.totalRejected = stat.count;
    result.total += stat.count;
  });

  return result;
};

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;

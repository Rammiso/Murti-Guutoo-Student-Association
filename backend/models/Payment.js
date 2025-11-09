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
paymentSchema.index({ fullName: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for payment age
paymentSchema.virtual("age").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Static method to get statistics
paymentSchema.statics.getStats = async function () {
  const total = await this.countDocuments();
  const totalAmountAgg = await this.aggregate([
    {
      $group: {
        _id: null,
        sum: {
          $sum: {
            $convert: {
              input: "$amount",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
    },
  ]);

  return {
    total,
    totalAmount: totalAmountAgg[0]?.sum || 0,
  };
};

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;

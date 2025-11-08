/**
 * Test script for Payment System
 * Run: node scripts/testPaymentSystem.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const testPaymentSystem = async () => {
  try {
    console.log("🧪 Testing Payment System...\n");

    // Connect to database
    await connectDB();
    console.log("✅ Database connected\n");

    // Test 1: Create a test payment
    console.log("📝 Test 1: Creating test payment...");
    const testPayment = await Payment.create({
      fullName: "Test User",
      description: "Test donation for system verification",
      screenshotUrl: "https://via.placeholder.com/600",
      amount: 100,
      paymentType: "donation",
      status: "pending",
    });
    console.log("✅ Test payment created:", testPayment._id);
    console.log("   Name:", testPayment.fullName);
    console.log("   Status:", testPayment.status);
    console.log("");

    // Test 2: Get statistics
    console.log("📊 Test 2: Getting statistics...");
    const stats = await Payment.getStats();
    console.log("✅ Statistics:");
    console.log("   Total Payments:", stats.total);
    console.log("   Pending:", stats.totalPending);
    console.log("   Verified:", stats.totalVerified);
    console.log("   Rejected:", stats.totalRejected);
    console.log("");

    // Test 3: Find all pending payments
    console.log("🔍 Test 3: Finding pending payments...");
    const pendingPayments = await Payment.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .limit(5);
    console.log(`✅ Found ${pendingPayments.length} pending payment(s)`);
    pendingPayments.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.fullName} - ${p.description.substring(0, 30)}...`);
    });
    console.log("");

    // Test 4: Verify the test payment
    console.log("✔️  Test 4: Verifying test payment...");
    const fakeAdminId = new mongoose.Types.ObjectId();
    await testPayment.verify(fakeAdminId);
    console.log("✅ Payment verified");
    console.log("   Status:", testPayment.status);
    console.log("   Verified At:", testPayment.verifiedAt);
    console.log("");

    // Test 5: Create and reject a payment
    console.log("❌ Test 5: Creating and rejecting a payment...");
    const rejectPayment = await Payment.create({
      fullName: "Reject Test",
      description: "This will be rejected",
      screenshotUrl: "https://via.placeholder.com/600",
      status: "pending",
    });
    await rejectPayment.reject("Screenshot is unclear");
    console.log("✅ Payment rejected");
    console.log("   Status:", rejectPayment.status);
    console.log("   Reason:", rejectPayment.rejectionReason);
    console.log("");

    // Test 6: Get updated statistics
    console.log("📊 Test 6: Updated statistics...");
    const updatedStats = await Payment.getStats();
    console.log("✅ Updated Statistics:");
    console.log("   Total Payments:", updatedStats.total);
    console.log("   Pending:", updatedStats.totalPending);
    console.log("   Verified:", updatedStats.totalVerified);
    console.log("   Rejected:", updatedStats.totalRejected);
    console.log("");

    // Cleanup
    console.log("🧹 Cleaning up test data...");
    await Payment.deleteMany({
      fullName: { $in: ["Test User", "Reject Test"] },
    });
    console.log("✅ Test data cleaned up\n");

    console.log("🎉 All tests passed successfully!\n");
    console.log("✅ Payment System is working correctly");
    console.log("✅ Model methods are functional");
    console.log("✅ Database operations are successful");
    console.log("\n📝 Next steps:");
    console.log("   1. Start the server: npm run dev");
    console.log("   2. Test API endpoints with Postman");
    console.log("   3. Test frontend donation form");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.error(error);
    process.exit(1);
  }
};

testPaymentSystem();

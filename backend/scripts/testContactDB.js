import mongoose from "mongoose";
import dotenv from "dotenv";
import Contact from "../models/Contact.js";
import User from "../models/User.js";

dotenv.config();

const testContactDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    // Check if Contact collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const contactCollection = collections.find(col => col.name === "contacts");
    
    if (contactCollection) {
      console.log("✅ Contact collection exists in database");
    } else {
      console.log("⚠️  Contact collection doesn't exist yet (will be created on first insert)");
    }

    // Count existing contacts
    const contactCount = await Contact.countDocuments();
    console.log(`📊 Total contacts in database: ${contactCount}`);

    // List all contacts
    if (contactCount > 0) {
      const contacts = await Contact.find()
        .populate("sender", "fname lname email")
        .sort({ createdAt: -1 });
      
      console.log("\n📩 Existing messages:");
      contacts.forEach((contact, index) => {
        console.log(`\n${index + 1}. From: ${contact.fullName} (${contact.senderEmail})`);
        console.log(`   Subject: ${contact.subject}`);
        console.log(`   Telegram: ${contact.telegram}`);
        console.log(`   Date: ${contact.createdAt}`);
        console.log(`   Message: ${contact.message.substring(0, 50)}...`);
      });
    } else {
      console.log("\n📭 No messages in database yet");
    }

    // Test creating a sample contact (optional - commented out)
    /*
    const testUser = await User.findOne({ role: "student" });
    if (testUser) {
      const testContact = new Contact({
        sender: testUser._id,
        fullName: "Test User",
        senderEmail: testUser.email,
        telegram: "@testuser",
        subject: "Test Message",
        message: "This is a test message to verify the database is working correctly."
      });
      await testContact.save();
      console.log("\n✅ Test contact created successfully!");
    }
    */

    console.log("\n✅ Database test completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database test failed:", error);
    process.exit(1);
  }
};

testContactDatabase();

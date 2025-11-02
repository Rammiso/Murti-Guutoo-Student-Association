import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);

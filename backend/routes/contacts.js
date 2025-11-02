import express from "express";
import { contactSchema } from "../validation/contactValidation.js";
import Contact from "../models/Contact.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// send contact message
router.post("/", protect, async (req, res) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const contact = new Contact({
      userId: req.user._id,
      subject: req.body.subject,
      message: req.body.message,
    });
    await contact.save();
    res.json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

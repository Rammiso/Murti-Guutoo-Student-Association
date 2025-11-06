import express from "express";
import { contactValidation } from "../middleware/validation.js";
import Contact from "../models/Contact.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// send contact message
router.post("/", protect, async (req, res) => {
  try {
    const { error } = contactValidation(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const contact = new Contact({
      sender: req.user._id,
      fullName: req.body.fullName,
      senderEmail: req.body.senderEmail,
      telegram: req.body.telegram,
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

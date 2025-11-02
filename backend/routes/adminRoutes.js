import express from "express";
import User from "../models/User.js";
import Resource from "../models/Resource.js";
import fs from "fs";
import path from "path";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { json } from "stream/consumers";

const router = express.Router();
router.get('/users',protect,isAdmin,async (req,res)=>{
  try {
    const users=await User.find();
    if (!users) {
      res.json({message:'users is not founded'})
    }
    res.json(users)
  } catch (error) {
    res.json({message:error.message})
  }
})
// Delete user
router.delete("/users/:id", protect, isAdmin, async (req,res)=>{
  const user = await User.findById(req.params.id);
  if(!user) return res.status(404).json({ message: "User not found" });
  if(user.profilePic) fs.unlinkSync(path.join(process.cwd(), user.profilePic));
  await user.deleteOne();
  res.json({ message: "User deleted" });
});

// Approve resource
router.put("/resources/approve/:id", protect, isAdmin, async (req,res)=>{
  const resource = await Resource.findById(req.params.id);
  if(!resource) return res.status(404).json({ message: "Resource not found" });
  resource.approved = true;
  await resource.save();
  res.json({ message: "Resource approved", resource });
});


// Delete resource
router.delete("/resources/:id", protect, isAdmin, async (req,res)=>{
  const resource = await Resource.findById(req.params.id);
  if(!resource) return res.status(404).json({ message: "Resource not found" });
  fs.unlinkSync(path.join(process.cwd(), resource.fileUrl));
  await resource.deleteOne();
  res.json({ message: "Resource deleted" });
});

export default router;

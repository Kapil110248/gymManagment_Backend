import express from "express";
import { upload } from "../config/cloudinary.js";
import {
  createStaff,
  updateStaff,
} from "../controllers/staff.controller.js";

const router = express.Router();

// ✅ Create staff with optional photo
router.post("/", upload.single("profilePhoto"), createStaff);

// ✅ Update staff with optional photo
router.put("/:id", upload.single("profilePhoto"), updateStaff);

export default router;

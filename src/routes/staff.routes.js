// routes/staff.routes.js
import express from "express";
import { upload } from "../config/cloudinary.js"; // Cloudinary config
import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.controller.js";

const router = express.Router();

// POST: Add new staff with profile image
router.post("/", upload.single("profilePhoto"), createStaff);

// GET: Fetch all staff
router.get("/", getAllStaff);

// GET: Fetch single staff by ID
router.get("/:id", getStaffById);

// PUT: Update staff with optional profile image
router.put("/:id", upload.single("profilePhoto"), updateStaff);

// DELETE: Remove staff
router.delete("/:id", deleteStaff);

export default router;

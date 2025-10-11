import express from "express";
import { upload } from "../config/cloudinary.js"; 
import {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} from "../controllers/branch.controller.js";

const router = express.Router();

// POST new branch with image
router.post("/", upload.single("avatar"), createBranch);

// PUT update branch with image
router.put("/:id", upload.single("avatar"), updateBranch);

// GET all branches
router.get("/", getAllBranches);

// GET branch by ID
router.get("/:id", getBranchById);

// DELETE branch
router.delete("/:id", deleteBranch);

export default router;

import express from "express";
import { upload } from "../config/cloudinary.js"; 
import {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/group.controller.js";

const router = express.Router();

router.get("/", getGroups);
router.get("/:id", getGroupById);
router.post("/", upload.single("photo"), createGroup);  // <-- image upload
router.put("/:id", upload.single("photo"), updateGroup); // <-- update with image
router.delete("/:id", deleteGroup);

export default router;

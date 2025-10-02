import express from "express";
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlan
} from "../controllers/plans.controller.js";

const router = express.Router();

router.get("/", getPlans);
router.post("/", createPlan);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);
router.patch("/:id/toggle", togglePlan);

export default router;

import express from "express";
import {
  getBookings,
  approveBooking,
  rejectBooking,
  getBookingById    // ✅ Optional: Get single booking
} from "../controllers/booking.controller.js";

const router = express.Router();

// ✅ Get all bookings
router.get("/", getBookings);

// ✅ Get single booking by ID (optional)
router.get("/:id", getBookingById);

// ✅ Approve booking
router.patch("/:id/approve", approveBooking);

// ✅ Reject booking
router.patch("/:id/reject", rejectBooking);

export default router;

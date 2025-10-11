import prisma from "../services/prismaClient.js";

// ✅ Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch bookings", error: error.message });
  }
};
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch booking", error: error.message });
  }
};

// ✅ Approve booking
export const approveBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: "approved" }
    });
    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to approve booking", error: error.message });
  }
};

// ✅ Reject booking
export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: "rejected" }
    });
    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reject booking", error: error.message });
  }
};

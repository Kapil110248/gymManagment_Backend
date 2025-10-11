// server.js
import express from "express";
import cors from "cors";

// Routes
import memberRoutes from "./src/routes/members.routes.js";
import staffRoutes from "./src/routes/staff.routes.js";
import planRoutes from "./src/routes/plans.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js";
import paymentRoutes from "./src/routes/payments.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import invoiceRoutes from "./src/routes/invoices.routes.js";
import groupRoutes from "./src/routes/group.routes.js";
import branchRoutes from "./src/routes/branch.routes.js";

// OPTIONAL: If your controllers use a shared prisma instance, keep it there.
// If you need it here (e.g., for health checks), import the same singleton:
import prisma from "./src/services/prismaClient.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ----------------------------
   Core middleware
---------------------------- */
app.use(cors({
  origin: true,               // allow all origins (tweak for production)
  credentials: true
}));

// Parse JSON bodies (increase limit if needed)
app.use(express.json({ limit: "2mb" }));

// Parse URL-encoded bodies (for form submissions without files)
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

/* ----------------------------
   Health & root routes
---------------------------- */
app.get("/", (_req, res) => {
  res.send("Gym Management API is running...");
});

app.get("/health", async (_req, res) => {
  try {
    // Quick DB ping using Prisma
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: "up" });
  } catch (e) {
    res.status(500).json({ ok: false, db: "down", error: e.message });
  }
});

/* ----------------------------
   API routes
---------------------------- */
app.use("/api/members", memberRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/branches", branchRoutes);

/* ----------------------------
   404 handler
---------------------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

/* ----------------------------
   Error handler
---------------------------- */
app.use((err, _req, res, _next) => {
  // You can add structured Prisma error handling here if desired
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

/* ----------------------------
   Start & graceful shutdown
---------------------------- */
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
    } catch {}
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

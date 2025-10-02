// server.js
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// Import Routes
import memberRoutes from "./src/routes/members.routes.js";
import staffRoutes from "./src/routes/staff.routes.js";
import planRoutes from "./src/routes/plans.routes.js";
import paymentRoutes from "./src/routes/payments.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import invoiceRoutes from "./src/routes/invoices.routes.js";
import groupRoutes from "./src/routes/group.routes.js";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/members", memberRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/groups", groupRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Gym Management API is running...");
});

// Example Prisma CRUD test (optional)
async function testPrisma() {
  try {
    // CREATE
    const newUser = await prisma.user.create({
      data: {
        name: "Kapil",
        email: "kapil@example.com",
        age: 25,
      },
    });
    console.log("Created User:", newUser);

    // READ
    const users = await prisma.user.findMany();
    console.log("All Users:", users);

    // UPDATE
    const updatedUser = await prisma.user.update({
      where: { email: "kapil@example.com" },
      data: { age: 26 },
    });
    console.log("Updated User:", updatedUser);

    // DELETE
    const deletedUser = await prisma.user.delete({
      where: { email: "kapil@example.com" },
    });
    console.log("Deleted User:", deletedUser);
  } catch (error) {
    console.error("Prisma Test Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  // testPrisma(); // 👉 Uncomment if you want to run the test once
});

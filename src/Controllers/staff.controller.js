// controllers/staff.controller.js
import prisma from "../services/prismaClient.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid"; // unique staffCode generate ke liye

// CREATE Staff
export const createStaff = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      dob,
      joinDate,
      salaryType,
      email,
      phone,
      role,
      status,
      exitDate,
      fixedSalary,
      hourlyRate,
      commissionRate,
      loginAccess,
      username,
      password,
      branchId,
    } = req.body;

    // Cloudinary file URL
    const profilePhoto = req.file?.path || null;

    // Hash password
    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const staff = await prisma.staff.create({
      data: {
        staffCode: `STAFF-${uuidv4()}`, // automatically unique
        firstName: firstName || "TempFirst",
        lastName: lastName || "TempLast",
        gender: gender || "MALE",
        dob: dob ? new Date(dob) : new Date(),
        joinDate: joinDate ? new Date(joinDate) : new Date(),
        salaryType: salaryType || "FIXED",
        email,
        phone,
        profilePhoto, // Cloudinary URL
        role,
        status: status || "ACTIVE",
        exitDate: exitDate ? new Date(exitDate) : null,
        fixedSalary: fixedSalary ? Number(fixedSalary) : null,
        hourlyRate: hourlyRate ? Number(hourlyRate) : null,
        commissionRate: commissionRate ? Number(commissionRate) : null,
        loginAccess: loginAccess ?? false,
        username: username || null,
        password: hashedPassword,
        branchId: branchId || null,
      },
    });

    res.status(201).json({ success: true, staff });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create staff",
      error: error.message,
    });
  }
};

// GET All Staff
export const getAllStaff = async (req, res) => {
  try {
    const staff = await prisma.staff.findMany({
      include: { branch: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, staff });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch staff",
      error: error.message,
    });
  }
};

// GET Staff by ID
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await prisma.staff.findUnique({
      where: { id: Number(id) },
      include: { branch: true },
    });
    if (!staff)
      return res.status(404).json({ success: false, message: "Staff not found" });
    res.json({ success: true, staff });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch staff",
      error: error.message,
    });
  }
};

// UPDATE Staff
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      gender,
      dob,
      joinDate,
      salaryType,
      email,
      phone,
      role,
      status,
      exitDate,
      fixedSalary,
      hourlyRate,
      commissionRate,
      loginAccess,
      username,
      password,
      branchId,
    } = req.body;

    const profilePhoto = req.file?.path || undefined;

    let hashedPassword = undefined;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const updatedStaff = await prisma.staff.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        gender,
        dob: dob ? new Date(dob) : undefined,
        joinDate: joinDate ? new Date(joinDate) : undefined,
        salaryType,
        email,
        phone,
        profilePhoto,
        role,
        status,
        exitDate: exitDate ? new Date(exitDate) : null,
        fixedSalary: fixedSalary ? Number(fixedSalary) : null,
        hourlyRate: hourlyRate ? Number(hourlyRate) : null,
        commissionRate: commissionRate ? Number(commissionRate) : null,
        loginAccess,
        username,
        password: hashedPassword,
        branchId,
      },
    });

    res.json({ success: true, staff: updatedStaff });
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update staff",
      error: error.message,
    });
  }
};

// DELETE Staff
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.staff.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete staff",
      error: error.message,
    });
  }
};

// controllers/branch.controller.js
import prisma from "../services/prismaClient.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// remove password before sending
const removeSensitive = (obj) => {
  if (!obj) return obj;
  const { password, ...safe } = obj;
  return safe;
};

const parseHours = (hours) => {
  if (hours === undefined || hours === null || hours === "") return {};
  if (typeof hours === "object") return hours;
  if (typeof hours === "string") {
    try { return JSON.parse(hours.trim()); } catch { return {}; }
  }
  return {};
};

// ------------------- CREATE -------------------
export const createBranch = async (req, res) => {
  try {
    const body = req.body ?? {};
    const {
      name,
      code,
      address,
      manager,
      phone,
      email,
      username,
      password,
      status,   // enum: ACTIVE | INACTIVE | MAINTENANCE
      hours
    } = body;

    // required as per schema (non-null fields)
    if (!name || !code || !address || !manager || !username || !password) {
      return res.status(400).json({
        success: false,
        message:
          "name, code, address, manager, username, password are required"
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // file → imageUrl (Cloudinary/Multer)
    const imageUrl = req.file?.path || null;

    const branch = await prisma.branch.create({
      data: {
        name,
        code,
        address,
        manager,
        phone: phone ?? null,
        email: email ?? null,
        username,
        password: hashedPassword,
        imageUrl,                         // matches schema
        status: (status || "INACTIVE"),   // enum CAPS
        hours: parseHours(hours)          // NOT NULL Json → default {}
      }
    });

    return res.status(201).json({ success: true, data: removeSensitive(branch) });
  } catch (error) {
    console.error("Error creating branch:", error);
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(", ") : error.meta?.target;
      return res.status(409).json({
        success: false,
        message: `Unique constraint failed on: ${target}`
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create branch",
      error: error.message
    });
  }
};

// ------------------- LIST -------------------
export const getAllBranches = async (_req, res) => {
  try {
    const rows = await prisma.branch.findMany({ orderBy: { createdAt: "desc" } });
    return res.json({ success: true, data: rows.map(removeSensitive) });
  } catch (error) {
    console.error("Error fetching branches:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch branches",
      error: error.message
    });
  }
};

// ------------------- GET BY ID -------------------
export const getBranchById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await prisma.branch.findUnique({ where: { id } });
    if (!row) return res.status(404).json({ success: false, message: "Branch not found" });
    return res.json({ success: true, data: removeSensitive(row) });
  } catch (error) {
    console.error("Error fetching branch:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch branch",
      error: error.message
    });
  }
};

// ------------------- UPDATE -------------------
export const updateBranch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = req.body ?? {};

    const data = {};

    // only set fields that are present
    if (body.name !== undefined) data.name = body.name;
    if (body.code !== undefined) data.code = body.code;
    if (body.address !== undefined) data.address = body.address; // required in schema, but here optional update
    if (body.manager !== undefined) data.manager = body.manager; // required in schema, but here optional update
    if (body.phone !== undefined) data.phone = body.phone ?? null;
    if (body.email !== undefined) data.email = body.email ?? null;
    if (body.username !== undefined) data.username = body.username;
    if (body.status !== undefined) data.status = body.status; // must be valid enum
    if (body.hours !== undefined) data.hours = parseHours(body.hours);

    if (body.password) {
      data.password = await bcrypt.hash(body.password, SALT_ROUNDS);
    }

    // file → imageUrl
    if (req.file?.path) data.imageUrl = req.file.path;

    const updated = await prisma.branch.update({
      where: { id },
      data
    });

    return res.json({ success: true, data: removeSensitive(updated) });
  } catch (error) {
    console.error("Error updating branch:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(", ") : error.meta?.target;
      return res.status(409).json({
        success: false,
        message: `Unique constraint failed on: ${target}`
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update branch",
      error: error.message
    });
  }
};

// ------------------- DELETE -------------------
export const deleteBranch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.branch.delete({ where: { id } });
    return res.json({ success: true, message: "Branch deleted successfully" });
  } catch (error) {
    console.error("Error deleting branch:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to delete branch",
      error: error.message
    });
  }
};

// controllers/branch.controller.js
import prisma from "../services/prismaClient.js";
import bcrypt from "bcrypt";

/** Parse hours which may come as string or object */
function parseHours(hours) {
  if (hours === undefined || hours === null || hours === "") return null;
  if (typeof hours === "object") return hours;
  if (typeof hours === "string") {
    const trimmed = hours.trim();
    if (!trimmed) return null;
    try { return JSON.parse(trimmed); } catch { return null; }
  }
  return null;
}

/** Normalize body even if middleware didn't populate it */
function getSafeBody(req) {
  // If body exists and has keys, use it
  if (req.body && typeof req.body === "object" && Object.keys(req.body).length) {
    return req.body;
  }
  // Fallback: if multer ran with no fields / wrong content-type, ensure we at least return {}
  return {};
}

/** Build human-friendly error explaining correct usage */
function bodyMissingError(res, req) {
  const ct = req.headers["content-type"] || "";
  return res.status(400).json({
    success: false,
    message:
      "No request body received. Send either multipart/form-data (with fields + optional file 'avatar') or application/json.",
    hint: {
      expected: [
        "multipart/form-data → Body: form-data fields name, code, username, password, status, hours; File key: avatar (optional)",
        "application/json → Body: { name, code, username, password, status, hours }"
      ],
      receivedContentType: ct
    }
  });
}

export const createBranch = async (req, res) => {
  try {
    const body = getSafeBody(req);

    if (!Object.keys(body).length) {
      return bodyMissingError(res, req);
    }

    const {
      name,
      code,
      address,
      manager,
      phone,
      email,
      username,
      password,
      status = "INACTIVE",
      hours
    } = body;

    if (!name || !code || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "name, code, username, password are required"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const imageUrl = req.file?.path || null; // cloudinary path if file uploaded
    const hoursJson = parseHours(hours);

    const branch = await prisma.branch.create({
      data: {
        name,
        code,
        address: address ?? "",
        manager: manager ?? "",
        phone: phone ?? null,
        email: email ?? null,
        username,
        password: hashed,
        imageUrl,
        status,          // must match BranchStatus enum values
        hours: hoursJson // JSON column
      }
    });

    return res.status(201).json({ success: true, data: branch });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: `Unique constraint failed on: ${err.meta?.target}`
      });
    }
    console.error("createBranch error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create branch", error: err.message });
  }
};

export const getAllBranches = async (_req, res) => {
  try {
    const rows = await prisma.branch.findMany({ orderBy: { createdAt: "desc" } });
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch branches", error: err.message });
  }
};

export const getBranchById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await prisma.branch.findUnique({ where: { id } });
    if (!row) return res.status(404).json({ success: false, message: "Branch not found" });
    return res.json({ success: true, data: row });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch branch", error: err.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = getSafeBody(req);

    if (!Object.keys(body).length && !req.file?.path) {
      return bodyMissingError(res, req);
    }

    const {
      name,
      code,
      address,
      manager,
      phone,
      email,
      username,
      password,
      status,
      hours
    } = body;

    const data = {
      ...(name !== undefined && { name }),
      ...(code !== undefined && { code }),
      ...(address !== undefined && { address }),
      ...(manager !== undefined && { manager }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(username !== undefined && { username }),
      ...(status !== undefined && { status })
    };

    if (password) data.password = await bcrypt.hash(password, 10);
    if (req.file?.path) data.imageUrl = req.file.path;

    if (hours !== undefined) {
      data.hours = parseHours(hours);
    }

    const updated = await prisma.branch.update({ where: { id }, data });
    return res.json({ success: true, data: updated });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: `Unique constraint failed on: ${err.meta?.target}`
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to update branch", error: err.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.branch.delete({ where: { id } });
    return res.json({ success: true, message: "Branch deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete branch", error: err.message });
  }
};

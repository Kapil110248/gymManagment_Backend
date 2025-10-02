import prisma from "../services/prismaClient.js";

// Get all groups
export const getGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, groups });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ success: false, message: "Failed to fetch groups", error: error.message });
  }
};

// Get single group
export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await prisma.group.findUnique({ where: { id: Number(id) } });
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });
    res.status(200).json({ success: true, group });
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ success: false, message: "Failed to fetch group", error: error.message });
  }
};

// Create new group
// Create new group
export const createGroup = async (req, res) => {
  try {
    const { name } = req.body; // text field
    const photo = req.file ? req.file.path : null; // cloudinary se url milega

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const group = await prisma.group.create({
      data: { name, photo },
    });

    res.status(201).json({ success: true, group });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create group",
      error: error.message,
    });
  }
};


// Update group
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Agar nayi image aayi hai to update karo
    const photo = req.file?.path || undefined;

    const group = await prisma.group.update({
      where: { id: Number(id) },
      data: {
        name,
        ...(photo && { photo }),
      },
    });

    res.status(200).json({ success: true, group });
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ success: false, message: "Failed to update group", error: error.message });
  }
};

// Delete group
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await prisma.group.delete({ where: { id: Number(id) } });
    res.status(200).json({ success: true, message: "Group deleted", group });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ success: false, message: "Failed to delete group", error: error.message });
  }
};

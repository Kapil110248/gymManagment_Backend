import prisma from "../services/prismaClient.js";

// CREATE Attendance
export const createAttendance = async (req, res) => {
  try {
    const { memberId, date, status } = req.body;
    const attendance = await prisma.attendance.create({
      data: { memberId, date, status },
    });
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all Attendance
export const getAttendance = async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany();
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET Attendance by ID
export const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await prisma.attendance.findUnique({
      where: { id: Number(id) },
    });

    if (!attendance) return res.status(404).json({ error: "Attendance not found" });

    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE Attendance
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId, date, status } = req.body;
    const updated = await prisma.attendance.update({
      where: { id: Number(id) },
      data: { memberId, date, status },
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE Attendance
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.attendance.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

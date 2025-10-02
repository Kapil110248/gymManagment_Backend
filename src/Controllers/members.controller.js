import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getMembers = async (req, res) => {
  try {
    const members = await prisma.member.findMany();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const member = await prisma.member.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const member = await prisma.member.create({ data: req.body });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const member = await prisma.member.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    await prisma.member.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "Member deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

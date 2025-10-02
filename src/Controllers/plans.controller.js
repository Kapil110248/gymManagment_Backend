import prisma from "../services/prismaClient.js";

// CREATE Plan
export const createPlan = async (req, res) => {
  try {
    const { name, price, duration } = req.body;
    const plan = await prisma.plan.create({ data: { name, price, duration } });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all Plans
export const getPlans = async (req, res) => {
  try {
    const plans = await prisma.plan.findMany();
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET Plan by ID
export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await prisma.plan.findUnique({ where: { id: Number(id) } });
    if (!plan) return res.status(404).json({ error: "Plan not found" });
    res.status(200).json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE Plan
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, duration } = req.body;
    const updated = await prisma.plan.update({ where: { id: Number(id) }, data: { name, price, duration } });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE Plan
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.plan.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
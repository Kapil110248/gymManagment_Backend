import prisma from "../services/prismaClient.js";

// ✅ Get all plans
export const getPlans = async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch plans", error: error.message });
  }
};

// ✅ Create new plan
export const createPlan = async (req, res) => {
  try {
    const { name, type, sessions, validity, price } = req.body;
    const plan = await prisma.plan.create({
      data: { name, type, sessions: Number(sessions), validity: Number(validity), price: Number(price) }
    });
    res.status(201).json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create plan", error: error.message });
  }
};

// ✅ Update plan
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, sessions, validity, price, isActive } = req.body;
    const plan = await prisma.plan.update({
      where: { id: Number(id) },
      data: { name, type, sessions, validity, price, isActive }
    });
    res.status(200).json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update plan", error: error.message });
  }
};

// ✅ Delete plan
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.plan.delete({ where: { id: Number(id) } });
    res.status(200).json({ success: true, message: "Plan deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete plan", error: error.message });
  }
};

// ✅ Toggle active/inactive
export const togglePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await prisma.plan.findUnique({ where: { id: Number(id) } });
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

    const updated = await prisma.plan.update({
      where: { id: Number(id) },
      data: { isActive: !plan.isActive }
    });

    res.status(200).json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to toggle plan", error: error.message });
  }
};

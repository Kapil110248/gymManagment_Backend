import prisma from "../services/prismaClient.js";

// CREATE Payment
export const createPayment = async (req, res) => {
  try {
    const { memberId, amount, date, method } = req.body;
    const payment = await prisma.payment.create({ data: { memberId, amount, date, method } });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all Payments
export const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany();
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET Payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({ where: { id: Number(id) } });
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE Payment
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId, amount, date, method } = req.body;
    const updated = await prisma.payment.update({ where: { id: Number(id) }, data: { memberId, amount, date, method } });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE Payment
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.payment.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

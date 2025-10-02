import prisma from "../services/prismaClient.js";

// CREATE Invoice
export const createInvoice = async (req, res) => {
  try {
    const { memberId, amount, date } = req.body;
    const invoice = await prisma.invoice.create({
      data: { memberId, amount, date },
    });
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all Invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany();
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET Invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({
      where: { id: Number(id) },
    });

    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE Invoice
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId, amount, date } = req.body;
    const updated = await prisma.invoice.update({
      where: { id: Number(id) },
      data: { memberId, amount, date },
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE Invoice
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.invoice.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

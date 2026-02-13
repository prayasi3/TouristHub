import Payment from "../models/Payment.js";

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.getAll();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.getById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payment" });
  }
};

export const getPaymentsByBooking = async (req, res) => {
  try {
    const payments = await Payment.getByBooking(req.params.booking_id);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch booking payments" });
  }
};

export const createPayment = async (req, res) => {
  try {
    const id = await Payment.create(req.body);
    res.status(201).json({
      message: "Payment recorded successfully",
      id
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create payment" });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const updated = await Payment.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json({ message: "Payment updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update payment" });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete payment" });
  }
};

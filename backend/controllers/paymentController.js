import Payment from "../models/Payment.js";

function normalizePaymentPayload(body = {}) {
  return {
    booking_id:
      body.booking_id === undefined || body.booking_id === null || body.booking_id === ""
        ? ""
        : Number(body.booking_id),
    amount:
      body.amount === undefined || body.amount === null || body.amount === ""
        ? ""
        : Number(body.amount),
    payment_method: String(body.payment_method || "").trim(),
    payment_status: String(body.payment_status || "paid").trim().toLowerCase(),
    transaction_id: String(body.transaction_id || `TXN-${Date.now()}`).trim(),
    payment_date: body.payment_date || null,
  };
}

function validatePaymentPayload(body = {}) {
  const payload = normalizePaymentPayload(body);
  const errors = [];

  if (payload.booking_id === "" || Number.isNaN(payload.booking_id) || payload.booking_id <= 0) {
    errors.push("booking_id must be a valid booking id");
  }

  if (payload.amount === "" || Number.isNaN(payload.amount) || payload.amount < 0) {
    errors.push("amount must be a non-negative number");
  }

  if (!payload.payment_method) {
    errors.push("payment_method is required");
  }

  if (!payload.payment_status) {
    errors.push("payment_status is required");
  }

  return { payload, errors };
}

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
    const { payload, errors } = validatePaymentPayload(req.body);

    if (errors.length) {
      return res.status(400).json({ message: "Invalid payment payload", errors });
    }

    const id = await Payment.create(payload);
    res.status(201).json({
      message: "Payment recorded successfully",
      id
    });
  } catch (err) {
    console.error("Payment create failed:", err.message);
    res.status(500).json({ message: err.message || "Failed to create payment" });
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

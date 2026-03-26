import axios from "axios";
import Payment from "../models/Payment.js";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const KHALTI_GATEWAY_URL = process.env.KHALTI_GATEWAY_URL || "https://a.khalti.com/api/v2";

// ─── helpers ────────────────────────────────────────────────────────────────

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

// ─── standard CRUD ──────────────────────────────────────────────────────────

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
      id,
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

// ─── Khalti ─────────────────────────────────────────────────────────────────

/**
 * POST /api/payments/khalti/initiate
 * Body: { booking_id, booking_number, amount (NPR) }
 * Returns: { payment_url, pidx }
 */
export const khaltiInitiate = async (req, res) => {
  try {
    const { booking_id, booking_number, amount } = req.body;

    if (!booking_id || !amount) {
      return res.status(400).json({ message: "booking_id and amount are required" });
    }

    const amountPaisa = Math.round(Number(amount) * 100); // Khalti expects paisa

    // Build return URL – the frontend route that handles the callback
    const returnUrl = `${req.headers.origin || "http://localhost:5173"}/payment/khalti-return`;

    const khaltiPayload = {
      return_url: returnUrl,
      website_url: req.headers.origin || "http://localhost:5173",
      amount: amountPaisa,
      purchase_order_id: `BOOKING-${booking_id}-${Date.now()}`,
      purchase_order_name: `TouristHub Booking #${booking_number || booking_id}`,
      customer_info: {
        name: "TouristHub Customer",
      },
    };

    const { data } = await axios.post(
      `${KHALTI_GATEWAY_URL}/epayment/initiate/`,
      khaltiPayload,
      {
        headers: {
          Authorization: KHALTI_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ payment_url: data.payment_url, pidx: data.pidx });
  } catch (err) {
    console.error("Khalti initiate error:", err.response?.data || err.message);
    res.status(502).json({
      message: "Failed to initiate Khalti payment",
      detail: err.response?.data || err.message,
    });
  }
};

/**
 * POST /api/payments/khalti/verify
 * Body: { pidx, booking_id, booking_number, amount }
 * Looks up payment with Khalti, then saves to DB on success.
 */
export const khaltiVerify = async (req, res) => {
  try {
    const { pidx, booking_id, booking_number, amount } = req.body;

    if (!pidx) {
      return res.status(400).json({ message: "pidx is required" });
    }

    // Lookup with Khalti
    const { data } = await axios.post(
      `${KHALTI_GATEWAY_URL}/epayment/lookup/`,
      { pidx },
      {
        headers: {
          Authorization: KHALTI_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (data.status !== "Completed") {
      return res.status(402).json({
        message: `Payment not completed. Khalti status: ${data.status}`,
        khalti: data,
      });
    }

    // Save to database
    const payload = normalizePaymentPayload({
      booking_id,
      amount,
      payment_method: "khalti",
      payment_status: "paid",
      transaction_id: pidx,
      payment_date: new Date().toISOString(),
    });

    const id = await Payment.create(payload);

    res.status(201).json({
      message: "Khalti payment verified and recorded",
      id,
      khalti: data,
    });
  } catch (err) {
    console.error("Khalti verify error:", err.response?.data || err.message);
    res.status(502).json({
      message: "Failed to verify Khalti payment",
      detail: err.response?.data || err.message,
    });
  }
};

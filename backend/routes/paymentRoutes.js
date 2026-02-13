import express from "express";
import {
  getPayments,
  getPaymentById,
  getPaymentsByBooking,
  createPayment,
  updatePayment,
  deletePayment
} from "../controllers/paymentController.js";

const router = express.Router();

// Get all payments
router.get("/", getPayments);

// Get single payment by ID
router.get("/:id", getPaymentById);

// Get all payments for a specific booking
router.get("/booking/:booking_id", getPaymentsByBooking);

// Create a new payment
router.post("/", createPayment);

// Update payment (status, transaction_id, payment_date)
router.put("/:id", updatePayment);

// Delete a payment (admin only)
router.delete("/:id", deletePayment);

export default router;

import express from "express";
import {
  getPayments,
  getPaymentById,
  getPaymentsByBooking,
  createPayment,
  updatePayment,
  deletePayment,
  khaltiInitiate,
  khaltiVerify,
} from "../controllers/paymentController.js";

const router = express.Router();

// ─── Khalti gateway routes (must be before /:id to avoid collision) ─────────
router.post("/khalti/initiate", khaltiInitiate);
router.post("/khalti/verify", khaltiVerify);

// ─── Standard CRUD ───────────────────────────────────────────────────────────
router.get("/", getPayments);
router.get("/booking/:booking_id", getPaymentsByBooking);
router.get("/:id", getPaymentById);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;

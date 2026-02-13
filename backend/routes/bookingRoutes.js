import express from "express";
import {
  getBookings,
  getBookingById,
  getBookingsByUser,
  createBooking,
  updateBooking,
  deleteBooking
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.get("/user/:user_id", getBookingsByUser);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;

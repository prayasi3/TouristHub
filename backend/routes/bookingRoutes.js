import express from "express";
import {
  getBookings,
  getBookingById,
  getBookingsByUser,
  createBooking,
  updateBooking,
  deleteBooking
} from "../controllers/bookingController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBookings);
router.get("/user/:user_id", verifyToken, getBookingsByUser); // specific first
router.get("/:id", getBookingById);
router.post("/", verifyToken, createBooking);
router.put("/:id", verifyToken, updateBooking);
router.delete("/:id", verifyToken, deleteBooking);

export default router;

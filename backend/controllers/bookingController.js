import Booking from "../models/Booking.js";

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.getById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch booking" });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.getByUser(req.params.user_id);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
};

export const createBooking = async (req, res) => {
  console.log("createBooking hit");        // ← keep this for now
  console.log("req.body:", req.body);

  try {
    const { destinationId, hotelId, flightId, travelDate } = req.body;
    const userId = req.user?.id || 1;

    // ← THIS is the critical part — destructure all three
    const { bookingId, bookingNumber, totalAmount } = await Booking.createFullBooking({
      userId,
      destinationId,
      hotelId,
      flightId,
      travelDate,
    });

    res.status(201).json({
      message: "Booking successful",
      bookingId,
      bookingNumber,
      totalAmount,
    });

  } catch (error) {
    console.error("Booking error:", error); // ← this will now show the real error
    res.status(500).json({ message: "Booking failed" });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const updated = await Booking.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update booking" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete booking" });
  }
};
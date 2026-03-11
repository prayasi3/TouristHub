import db from "../config/db.js";

class Booking {

static async createFullBooking(data) {

 const connection = await db.getConnection();

 try {

  await connection.beginTransaction();

  const { userId, destinationId, hotelId, flightId, travelDate } = data;

  // 1️⃣ create main booking
  const [bookingResult] = await connection.query(
   `INSERT INTO bookings (user_id, booking_status, payment_status)
    VALUES (?, 'pending','pending')`,
   [userId]
  );

  const bookingId = bookingResult.insertId;

  // 2️⃣ destination booking
  await connection.query(
   `INSERT INTO destination_bookings (booking_id,destination_id,travel_date)
    VALUES (?,?,?)`,
   [bookingId, destinationId, travelDate]
  );

  // 3️⃣ hotel booking
  await connection.query(
   `INSERT INTO hotel_bookings (booking_id,hotel_id)
    VALUES (?,?)`,
   [bookingId, hotelId]
  );

  // 4️⃣ flight booking
  await connection.query(
   `INSERT INTO flight_bookings (booking_id,flight_id)
    VALUES (?,?)`,
   [bookingId, flightId]
  );

  await connection.commit();

  return bookingId;

 } catch (error) {

  await connection.rollback();
  throw error;

 } finally {

  connection.release();

 }

}

}

export default Booking;
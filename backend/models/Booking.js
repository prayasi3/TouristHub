import db from "../config/db.js";

function toDateOnly(value) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

class Booking {

  static async createFullBooking(data) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const { userId, destinationId, hotelId, flightId, travelDate, nights = 1 } = data;

      if (!hotelId && !flightId) {
        throw new Error("Select at least a hotel or a flight");
      }

      let hotel = null;
      let flight = null;

      if (hotelId) {
        const [hotelRows] = await connection.query(
          `SELECT price_per_night FROM hotels WHERE id = ?`,
          [hotelId]
        );
        hotel = hotelRows[0] || null;
      }

      if (flightId) {
        const [flightRows] = await connection.query(
          `SELECT price, date FROM flights WHERE id = ?`,
          [flightId]
        );
        flight = flightRows[0] || null;
      }

      if (hotelId && !hotel) {
        throw new Error("Selected hotel was not found");
      }

      if (flightId && !flight) {
        throw new Error("Selected flight was not found");
      }

      const hotelPrice = parseFloat(hotel?.price_per_night || 0);
      const flightPrice = parseFloat(flight?.price || 0);
      const nightsNum = parseInt(nights || 1);
      const effectiveTravelDate = toDateOnly(travelDate || flight?.date);

      const totalAmount = flightPrice + hotelPrice * nightsNum;

      const bookingNumber = `BK-${Date.now()}-${userId}`;

      // Insert booking
      const [bookingResult] = await connection.query(
        `INSERT INTO bookings 
        (user_id, booking_number, total_amount, booking_status, payment_status)
        VALUES (?, ?, ?, 'confirmed', 'pending')`,
        [userId, bookingNumber, totalAmount]
      );

      const bookingId = bookingResult.insertId;

      // Insert into junction tables
      await connection.query(
        `INSERT INTO destination_bookings (booking_id, destination_id, travel_date)
        VALUES (?, ?, ?)`,
        [bookingId, destinationId, effectiveTravelDate]
      );

      if (hotelId) {
        await connection.query(
          `INSERT INTO hotel_bookings (booking_id, hotel_id)
          VALUES (?, ?)`,
          [bookingId, hotelId]
        );
      }

      if (flightId) {
        await connection.query(
          `INSERT INTO flight_bookings (booking_id, flight_id)
          VALUES (?, ?)`,
          [bookingId, flightId]
        );
      }

      await connection.commit();

      return { bookingId, bookingNumber, totalAmount };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getByUser(userId) {
    const [rows] = await db.query(
      `SELECT 
         b.id,
         b.booking_number,
         b.total_amount,
         b.booking_status,
         b.payment_status,
         b.created_at,
         d.name        AS destination_name,
         h.name        AS hotel_name,
         h.price_per_night AS hotel_price_per_night,
         f.airline,
         f.flight_number,
         f.price       AS flight_price,
         db2.travel_date,
         p.payment_method
       FROM bookings b
       LEFT JOIN destination_bookings db2 ON db2.booking_id = b.id
       LEFT JOIN destinations d           ON d.id = db2.destination_id
       LEFT JOIN hotel_bookings hb        ON hb.booking_id = b.id
       LEFT JOIN hotels h                 ON h.id = hb.hotel_id
       LEFT JOIN flight_bookings fb       ON fb.booking_id = b.id
       LEFT JOIN flights f                ON f.id = fb.flight_id
       LEFT JOIN payments p               ON p.booking_id = b.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async getAll() {
    const [rows] = await db.query(`SELECT * FROM bookings ORDER BY created_at DESC`);
    return rows;
  }

  static async getById(id) {
    const [[row]] = await db.query(`SELECT * FROM bookings WHERE id = ?`, [id]);
    return row;
  }

  static async update(id, data) {
    const [result] = await db.query(
      `UPDATE bookings SET booking_status = ?, payment_status = ? WHERE id = ?`,
      [data.booking_status, data.payment_status, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query(`DELETE FROM bookings WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
}

export default Booking;

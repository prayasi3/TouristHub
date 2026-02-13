import db from "../config/db.js";

class Booking {
  // Get all bookings
  static async getAll() {
    const [rows] = await db.query(
      `SELECT * FROM bookings ORDER BY created_at DESC`
    );
    return rows;
  }

  // Get booking by ID
  static async getById(id) {
    const [rows] = await db.query(
      `SELECT * FROM bookings WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  // Get bookings by user
  static async getByUser(user_id) {
    const [rows] = await db.query(
      `SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC`,
      [user_id]
    );
    return rows;
  }

  // Create booking
  static async create(data) {
    const {
      user_id,
      booking_type,
      reference_id,
      amount,
      payment_method,
      payment_status,
      transaction_id,
      booking_status
    } = data;

    const [result] = await db.query(
      `INSERT INTO bookings
      (user_id, booking_type, reference_id, amount, payment_method,
       payment_status, transaction_id, booking_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        booking_type,
        reference_id,
        amount,
        payment_method,
        payment_status,
        transaction_id,
        booking_status
      ]
    );

    return result.insertId;
  }

  // Update booking
  static async update(id, data) {
    const {
      payment_method,
      payment_status,
      transaction_id,
      booking_status
    } = data;

    const [result] = await db.query(
      `UPDATE bookings SET
        payment_method = ?,
        payment_status = ?,
        transaction_id = ?,
        booking_status = ?
       WHERE id = ?`,
      [
        payment_method,
        payment_status,
        transaction_id,
        booking_status,
        id
      ]
    );

    return result.affectedRows;
  }

  // Delete booking
  static async delete(id) {
    const [result] = await db.query(
      `DELETE FROM bookings WHERE id = ?`,
      [id]
    );
    return result.affectedRows;
  }
}

export default Booking;

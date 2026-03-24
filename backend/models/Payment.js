import db from "../config/db.js";

function toMySqlDateTime(value) {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    const fallback = new Date();
    return fallback.toISOString().slice(0, 19).replace("T", " ");
  }

  return date.toISOString().slice(0, 19).replace("T", " ");
}

class Payment {
  // Get all payments
  static async getAll() {
    const [rows] = await db.query(
      `SELECT * FROM payments ORDER BY payment_date DESC`
    );
    return rows;
  }

  // Get payment by ID
  static async getById(id) {
    const [rows] = await db.query(
      `SELECT * FROM payments WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  // Get payments by booking
  static async getByBooking(booking_id) {
    const [rows] = await db.query(
      `SELECT * FROM payments WHERE booking_id = ? ORDER BY payment_date DESC`,
      [booking_id]
    );
    return rows;
  }

  // Create payment
  static async create(data) {
    const {
      booking_id,
      amount,
      payment_method,
      payment_status,
      transaction_id,
      payment_date
    } = data;

    const [result] = await db.query(
      `INSERT INTO payments
      (booking_id, amount, payment_method, payment_status, transaction_id, payment_date)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        booking_id,
        amount,
        payment_method,
        payment_status,
        transaction_id,
        toMySqlDateTime(payment_date),
      ]
    );

    await db.query(
      `UPDATE bookings
       SET payment_status = ?
       WHERE id = ?`,
      [payment_status || "paid", booking_id],
    );

    return result.insertId;
  }

  // Update payment
  static async update(id, data) {
    const { payment_status, transaction_id, payment_date } = data;

    const [result] = await db.query(
      `UPDATE payments SET
        payment_status = ?,
        transaction_id = ?,
        payment_date = ?
       WHERE id = ?`,
      [
        payment_status,
        transaction_id,
        toMySqlDateTime(payment_date),
        id
      ]
    );

    return result.affectedRows;
  }

  // Delete payment
  static async delete(id) {
    const [result] = await db.query(
      `DELETE FROM payments WHERE id = ?`,
      [id]
    );
    return result.affectedRows;
  }
}

export default Payment;

import db from "../config/db.js";

class Flight {
  // Get all flights
  static async getAll(filters = {}) {
    const conditions = [];
    const params = [];

    if (filters.source) {
      conditions.push(`LOWER(source) LIKE ?`);
      params.push(`%${String(filters.source).trim().toLowerCase()}%`);
    }

    if (filters.destination) {
      conditions.push(`LOWER(destination) LIKE ?`);
      params.push(`%${String(filters.destination).trim().toLowerCase()}%`);
    }

    if (filters.date) {
      conditions.push(`date = ?`);
      params.push(filters.date);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const [rows] = await db.query(
      `SELECT id, airline, flight_number, source, destination, price, date, departure_time, arrival_time, created_at
       FROM flights
       ${whereClause}
       ORDER BY date ASC, departure_time ASC, arrival_time ASC`,
      params,
    );
    return rows;
  }

  // Get flight by ID
  static async getById(id) {
    const [rows] = await db.query(
      `SELECT * FROM flights WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  // Create flight
  static async create(data) {
    const {
      airline,
      flight_number,
      source,
      destination,
      price,
      date,
      departure_time,
      arrival_time
    } = data;

    const [result] = await db.query(
      `INSERT INTO flights
      (airline, flight_number, source, destination, price, date, departure_time, arrival_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        airline,
        flight_number,
        source,
        destination,
        price,
        date,
        departure_time,
        arrival_time
      ]
    );

    return result.insertId;
  }

  // Update flight
  static async update(id, data) {
    const {
      airline,
      flight_number,
      source,
      destination,
      price,
      date,
      departure_time,
      arrival_time
    } = data;

    const [result] = await db.query(
      `UPDATE flights SET
        airline = ?,
        flight_number = ?,
        source = ?,
        destination = ?,
        price = ?,
        date = ?,
        departure_time = ?,
        arrival_time = ?
       WHERE id = ?`,
      [
        airline,
        flight_number,
        source,
        destination,
        price,
        date,
        departure_time,
        arrival_time,
        id
      ]
    );

    return result.affectedRows;
  }

  // Delete flight
  static async delete(id) {
    const [result] = await db.query(
      `DELETE FROM flights WHERE id = ?`,
      [id]
    );
    return result.affectedRows;
  }
}

export default Flight;

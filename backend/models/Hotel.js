import db from "../config/db.js";

class Hotel {
  // Get all hotels
  static async getAll(filters = {}) {
    const conditions = [];
    const params = [];

    if (filters.location) {
      conditions.push(`LOWER(location) LIKE ?`);
      params.push(`%${String(filters.location).trim().toLowerCase()}%`);
    }

    if (filters.name) {
      conditions.push(`LOWER(name) LIKE ?`);
      params.push(`%${String(filters.name).trim().toLowerCase()}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const [rows] = await db.query(
      `SELECT id, name, location, price_per_night, contact_info, created_at
       FROM hotels
       ${whereClause}
       ORDER BY location ASC, name ASC`,
      params,
    );
    return rows;
  }

  // Get hotel by ID
  static async getById(id) {
    const [rows] = await db.query(
      `SELECT id, name, location, price_per_night, contact_info, created_at
       FROM hotels
       WHERE id = ?`,
      [id],
    );
    return rows[0];
  }

  // Create hotel
  static async create(data) {
    const { name, location, price_per_night, contact_info } = data;

    const [result] = await db.query(
      `INSERT INTO hotels (name, location, price_per_night, contact_info)
       VALUES (?, ?, ?, ?)`,
      [name, location, price_per_night, contact_info]
    );

    return result.insertId;
  }

  // Update hotel
  static async update(id, data) {
    const { name, location, price_per_night, contact_info } = data;

    const [result] = await db.query(
      `UPDATE hotels 
       SET name = ?, location = ?, price_per_night = ?, contact_info = ?
       WHERE id = ?`,
      [name, location, price_per_night, contact_info, id]
    );

    return result.affectedRows;
  }

  // Delete hotel
  static async delete(id) {
    const [result] = await db.query(`DELETE FROM hotels WHERE id = ?`, [id]);
    return result.affectedRows;
  }
}

export default Hotel;

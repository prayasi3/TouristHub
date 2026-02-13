import db from "../config/db.js";

class Hotel {
  // Get all hotels (with images)
  static async getAll() {
    const [rows] = await db.query(`
      SELECT 
        h.*,
        GROUP_CONCAT(hi.image_url) AS images
      FROM hotels h
      LEFT JOIN hotel_images hi ON h.id = hi.hotel_id
      GROUP BY h.id
    `);
    return rows;
  }

  // Get hotel by ID
  static async getById(id) {
    const [rows] = await db.query(
      `
      SELECT 
        h.*,
        GROUP_CONCAT(hi.image_url) AS images
      FROM hotels h
      LEFT JOIN hotel_images hi ON h.id = hi.hotel_id
      WHERE h.id = ?
      GROUP BY h.id
      `,
      [id]
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
    // delete images first (FK safety)
    await db.query(`DELETE FROM hotel_images WHERE hotel_id = ?`, [id]);
    const [result] = await db.query(`DELETE FROM hotels WHERE id = ?`, [id]);
    return result.affectedRows;
  }
}

export default Hotel;

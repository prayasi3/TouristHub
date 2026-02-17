import db from "../config/db.js";

class TourGuide {

  // Get all guides
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM tour_guides");
    return rows;
  }

  // Get by ID
  static async getById(id) {
    const [rows] = await db.query(
      "SELECT * FROM tour_guides WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  // Create guide
  static async create(data) {
    const { name, experience, languages, specialties, rate_per_hour, contact, photo_url } = data;

    const [result] = await db.query(
      `INSERT INTO tour_guides 
       (name, experience, languages, specialties, rate_per_hour, contact, photo_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, experience, languages, specialties, rate_per_hour, contact, photo_url]
    );

    return result.insertId;
  }

  // Update guide
  static async update(id, data) {
    const { name, experience, languages, specialties, rate_per_hour, contact, photo_url } = data;

    const [result] = await db.query(
      `UPDATE tour_guides SET
        name = ?,
        experience = ?,
        languages = ?,
        specialties = ?,
        rate_per_hour = ?,
        contact = ?,
        photo_url = ?
       WHERE id = ?`,
      [name, experience, languages, specialties, rate_per_hour, contact, photo_url, id]
    );

    return result.affectedRows;
  }

  // Delete guide
  static async delete(id) {
    const [result] = await db.query(
      "DELETE FROM tour_guides WHERE id = ?",
      [id]
    );

    return result.affectedRows;
  }
}

export default TourGuide;

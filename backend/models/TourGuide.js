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
    const {
      name,
      experience,
      languages,
      specialties,
      rate_per_hour,
      contact,
      email,
      photo_url,
    } = data;

    const [result] = await db.query(
      `INSERT INTO tour_guides 
       (name, experience, languages, specialties, rate_per_hour, contact, email, photo_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(name || "").trim(),
        String(experience || "").trim(),
        String(languages || "").trim(),
        String(specialties || "").trim(),
        rate_per_hour,
        String(contact || "").trim(),
        String(email || "").trim(),
        String(photo_url || "").trim(),
      ]
    );

    return result.insertId;
  }

  // Update guide
  static async update(id, data) {
    const {
      name,
      experience,
      languages,
      specialties,
      rate_per_hour,
      contact,
      email,
      photo_url,
    } = data;

    const [result] = await db.query(
      `UPDATE tour_guides SET
        name = ?,
        experience = ?,
        languages = ?,
        specialties = ?,
        rate_per_hour = ?,
        contact = ?,
        email = ?,
        photo_url = ?
       WHERE id = ?`,
      [
        String(name || "").trim(),
        String(experience || "").trim(),
        String(languages || "").trim(),
        String(specialties || "").trim(),
        rate_per_hour,
        String(contact || "").trim(),
        String(email || "").trim(),
        String(photo_url || "").trim(),
        id,
      ]
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

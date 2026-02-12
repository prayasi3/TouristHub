import db from "../config/db.js";

class Campaign {
  constructor(id, title, description, start_date, end_date, banner_url) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.start_date = start_date;
    this.end_date = end_date;
    this.banner_url = banner_url;
  }

  // Get all campaigns
  static async getAll() {
    const [rows] = await db.query(
      `SELECT id, title, description, start_date, end_date, banner_url
       FROM campaigns
       ORDER BY start_date DESC`
    );
    return rows;
  }

  // Get campaign by ID
  static async getById(id) {
    const [rows] = await db.query(
      `SELECT id, title, description, start_date, end_date, banner_url
       FROM campaigns
       WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  // Create new campaign
  static async create({ title, description, start_date, end_date, banner_url }) {
    const [result] = await db.query(
      `INSERT INTO campaigns
       (title, description, start_date, end_date, banner_url)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, start_date, end_date, banner_url]
    );

    return {
      id: result.insertId,
      title,
      description,
      start_date,
      end_date,
      banner_url
    };
  }

  // Update campaign
  static async update(id, { title, description, start_date, end_date, banner_url }) {
    const [result] = await db.query(
      `UPDATE campaigns
       SET title=?, description=?, start_date=?, end_date=?, banner_url=?
       WHERE id=?`,
      [title, description, start_date, end_date, banner_url, id]
    );

    return result.affectedRows > 0;
  }

  // Delete campaign
  static async delete(id) {
    const [result] = await db.query(
      "DELETE FROM campaigns WHERE id=?",
      [id]
    );

    return result.affectedRows > 0;
  }
}

export default Campaign;

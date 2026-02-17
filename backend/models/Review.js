import db from "../config/db.js";

class Review {

  // Get all reviews
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM reviews");
    return rows;
  }

  // Get review by ID
  static async getById(id) {
    const [rows] = await db.query(
      "SELECT * FROM reviews WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  // Create review
  static async create(data) {
    const { user_id, review_type, reference_id, rating, comment } = data;

    const [result] = await db.query(
      `INSERT INTO reviews 
       (user_id, review_type, reference_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, review_type, reference_id, rating, comment]
    );

    return result.insertId;
  }

  // Update review
  static async update(id, data) {
    const { user_id, review_type, reference_id, rating, comment } = data;

    const [result] = await db.query(
      `UPDATE reviews SET
        user_id = ?,
        review_type = ?,
        reference_id = ?,
        rating = ?,
        comment = ?
       WHERE id = ?`,
      [user_id, review_type, reference_id, rating, comment, id]
    );

    return result.affectedRows;
  }

  // Delete review
  static async delete(id) {
    const [result] = await db.query(
      "DELETE FROM reviews WHERE id = ?",
      [id]
    );

    return result.affectedRows;
  }
}

export default Review;

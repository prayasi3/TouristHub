import db from '../config/db.js';

class Destination {
  // Fetch all destinations
  static async findAll() {
    const [rows] = await db.query('SELECT id, name, location, description, image_url FROM destinations');
    return rows;
  }

  // Fetch a single destination by ID
  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, location, description, image_url FROM destinations WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Create a new destination
  static async create(data) {
    const { name, location, description, image_url } = data;

    const [result] = await db.query(
      'INSERT INTO destinations (name, location, description, image_url) VALUES (?, ?, ?, ?)',
      [name, location, description, image_url]
    );

    return { id: result.insertId, ...data };
  }

  // Update an existing destination
  static async update(id, data) {
    const { name, location, description, image_url } = data;

    const [result] = await db.query(
      'UPDATE destinations SET name = ?, location = ?, description = ?, image_url = ? WHERE id = ?',
      [name, location, description, image_url, id]
    );

    return result.affectedRows;
  }

  // Delete a destination
  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM destinations WHERE id = ?',
      [id]
    );

    return result.affectedRows;
  }
}

export default Destination;

import db from '../config/db.js';

class Destination {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM destinations');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM destinations WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(data) {
    const { name, location, description, image } = data;

    const [result] = await db.query(
      'INSERT INTO destinations (name, location, description, image) VALUES (?, ?, ?, ?)',
      [name, location, description, image]
    );

    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const { name, location, description, image } = data;

    const [result] = await db.query(
      'UPDATE destinations SET name = ?, location = ?, description = ?, image = ? WHERE id = ?',
      [name, location, description, image, id]
    );

    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM destinations WHERE id = ?',
      [id]
    );

    return result.affectedRows;
  }
}

export default Destination;

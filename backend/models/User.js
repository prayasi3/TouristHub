import db from "../config/db.js";

const User = {
  create: (user, callback) => {
    const sql = `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [user.name, user.email, user.password, user.role || "USER"], callback);
  },

  findByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },

  getAll: async () => {
    const [rows] = await db.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC"
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  updateById: async (id, payload) => {
    const fields = [];
    const values = [];

    if (payload.name) {
      fields.push("name = ?");
      values.push(payload.name);
    }

    if (payload.email) {
      fields.push("email = ?");
      values.push(payload.email);
    }

    if (payload.role) {
      fields.push("role = ?");
      values.push(payload.role);
    }

    if (payload.password) {
      fields.push("password = ?");
      values.push(payload.password);
    }

    if (fields.length === 0) {
      return false;
    }

    values.push(id);
    const [result] = await db.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  deleteById: async (id) => {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};

export default User;

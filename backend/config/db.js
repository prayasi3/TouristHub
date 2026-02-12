import mysql from "mysql2/promise";
import "dotenv/config";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB connection once at startup (Promise-safe)
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("MySQL connected");
    connection.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
})();

export default db;

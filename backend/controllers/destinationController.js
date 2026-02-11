import db from "../config/db.js";

export const addDestination = async (req, res) => {
  try {
    const { name, location, description, image } = req.body;

    const sql = "INSERT INTO destinations (name, location, description, image) VALUES (?, ?, ?, ?)";
    await db.query(sql, [name, location, description, image]);

    res.status(201).json({ message: "Destination added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Load DB (just initializing connection)
require("./config/db");

// Initialize Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Test root
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 404 Handler (ALWAYS after routes)
app.use((req, res) => {
  console.log("Route hit:", req.method, req.path);
  res.status(404).json({
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import 'dotenv/config';
import express from "express";
import cors from "cors";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import destinationsRoutes from "./routes/destinations.js";

// Initialize Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationsRoutes);

// Test root
app.get("/", (req, res) => {
  res.send("Backend is running");
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

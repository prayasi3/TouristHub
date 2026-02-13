import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import destinationsRoutes from "./routes/destinations.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import flightRoutes from "./routes/flightRoutes.js";

// Initialize Express
const app = express();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static images from public folder
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationsRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/flights", flightRoutes);

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

import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
console.log("ENV CHECK:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  db: process.env.DB_NAME,
  pass: process.env.DB_PASSWORD ? "loaded" : "MISSING"
});
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/db.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import destinationsRoutes from "./routes/destinations.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import flightRoutes from "./routes/flightRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import tourGuideRoutes from "./routes/tourGuideRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

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

app.use((req, res, next) => {
  console.log(`Route hit: ${req.method} ${req.url}`);
  next();
});

const seedAdminUser = async () => {
  const adminEmail = "prayasi123@gmail.com";
  const adminPassword = "prayasi123";

  try {
    const [rows] = await db.query("SELECT id, role FROM users WHERE email = ?", [adminEmail]);

    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Prayasi Admin", adminEmail, hashedPassword, "ADMIN"]
      );
      console.log(`Seeded admin user: ${adminEmail}`);
      return;
    }

    if (rows[0].role !== "ADMIN") {
      await db.query("UPDATE users SET role = 'ADMIN' WHERE id = ?", [rows[0].id]);
      console.log(`Promoted existing user to admin: ${adminEmail}`);
    }
  } catch (error) {
    console.error("Failed to seed admin user:", error.message);
  }
};
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/destinations", destinationsRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tour-guides", tourGuideRoutes);
app.use("/api/reviews", reviewRoutes);

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
seedAdminUser().finally(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

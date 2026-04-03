import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "CollabNote API is running" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  if (!error) {
    return next();
  }

  if (error.message === "Only PDF files are allowed") {
    return res.status(400).json({ message: error.message });
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ message: "PDF file size must be 10MB or less" });
  }

  return res.status(500).json({
    message: error.message || "Server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
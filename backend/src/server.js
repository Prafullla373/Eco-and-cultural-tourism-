import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import cultureRoutes from "./routes/cultureRoutes.js";
import wildlifeRoutes from "./routes/wildlifeRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import exploreRoutes from "./routes/exploreRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import handicraftRoutes from "./routes/handicraftRoutes.js";


import { connectDB } from "./config/db.js";
import { PORT, CLIENT_URL, NODE_ENV } from "./config/env.js";

// Load env vars if not already loaded by config/env.js
dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: CLIENT_URL || "http://localhost:5173",
    credentials: true,
    exposedHeaders: ['Content-Disposition', 'Content-Type']
  })
);

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/culture", cultureRoutes);
app.use("/api/wildlife", wildlifeRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/handicrafts", handicraftRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Jharkhand Tourism API is running",
    environment: NODE_ENV,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

// Load environment variables from .env
dotenv.config();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const __dirname = path.resolve();

// ----------------------
// Middleware
// ----------------------
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL, // Use env variable
    credentials: true,
  })
);

// ----------------------
// API Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ----------------------
// Serve Frontend in Production
// ----------------------
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendDistPath));

  // Catch-all route for SPA
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, "index.html"));
  });
}

// ----------------------
// Start Server
// ----------------------
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});

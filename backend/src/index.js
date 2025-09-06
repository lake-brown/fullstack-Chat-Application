import express from "express";
import http from "http";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { initSocket } from "./lib/socket.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const __dirname = path.resolve();

const app = express();
const server = http.createServer(app);

// ----------------------
// Middleware
// ----------------------
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
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
  app.get("/*", (req, res) =>
    res.sendFile(path.resolve(frontendDistPath, "index.html"))
  );
}

// ----------------------
// Socket.io
// ----------------------
const { io } = initSocket(server);

// ----------------------
// Start Server
// ----------------------
server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
  connectDB();
});

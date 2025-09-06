import { Server } from "socket.io";

let io; // Singleton instance of Socket.io
const userSocketMap = {}; // { userId: socketId }

export function initSocket(server) {
  if (io) return io; // Prevent multiple initializations

  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"], // Add production frontend URL if needed
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // Broadcast current online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
}

// Global accessor for receiver socket ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Optional: export io if already initialized
export { io };

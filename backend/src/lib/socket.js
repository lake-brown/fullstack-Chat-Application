import { Server } from "socket.io";

let io; // Singleton Socket.io instance
const userSocketMap = {}; // { userId: socketId }

export function initSocket(server) {
  if (io) return io; // prevent multiple initializations

  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"], // add frontend production URL if needed
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
}

// Access socket ID of a specific user
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Optional: export io if needed globally
export { io };

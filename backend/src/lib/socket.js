import { Server } from "socket.io";

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
    },
  });

  const userSocketMap = {}; // { userId: socketId }

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return {
    io,
    getReceiverSocketId: (userId) => userSocketMap[userId],
  };
}

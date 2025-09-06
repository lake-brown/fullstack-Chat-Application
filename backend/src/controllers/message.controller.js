import { io, getReceiverSocketId } from "../lib/socket.js";

// Example: sending a message
export const sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const receiverId = req.params.id;
  const { text } = req.body;

  if (!io) {
    return res.status(500).json({ error: "Socket.io not initialized" });
  }

  // Emit message to the receiver if online
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", {
      senderId,
      text,
    });
  }

  // Save message to DB here (if you have a Message model)
  // await Message.create({ sender: senderId, receiver: receiverId, text });

  res.status(200).json({ success: true, message: "Message sent" });
};

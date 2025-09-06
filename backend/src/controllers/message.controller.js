import { io, getReceiverSocketId } from "../lib/socket.js";

// Fetch messages for a specific conversation
export const getMessages = async (req, res) => {
  const receiverId = req.params.id;
  // Example: fetch messages from DB
  // const messages = await Message.find({ ... });
  res.status(200).json({ messages: [] });
};

// Fetch users for sidebar (example)
export const getUsersForSidebar = async (req, res) => {
  // Example: fetch all users except current user
  // const users = await User.find({ _id: { $ne: req.user.id } });
  res.status(200).json({ users: [] });
};

// Send a message
export const sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const receiverId = req.params.id;
  const { text } = req.body;

  // Emit message to receiver if online
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", { senderId, text });
  }

  // Save message to DB (optional)
  // await Message.create({ sender: senderId, receiver: receiverId, text });

  res.status(200).json({ success: true });
};

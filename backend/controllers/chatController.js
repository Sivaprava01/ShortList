const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Job = require("../models/Job");

// START or GET existing chat between recruiter and candidate for a job
exports.startChat = async (req, res) => {
  try {
    const { jobId, candidateId } = req.params;
    const recruiterId = req.user._id;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [recruiterId, candidateId] },
      jobId
    });

    if (chat) {
      return res.json(chat);
    }

    // Verify the job belongs to this recruiter
    const job = await Job.findById(jobId);
    if (!job || job.recruiterId.toString() !== recruiterId.toString()) {
      return res.status(403).json({ message: "Not authorized to start this chat" });
    }

    // Create new chat
    chat = await Chat.create({
      participants: [recruiterId, candidateId],
      jobId
    });

    // Notify the candidate
    await Notification.create({
      userId: candidateId,
      type: "system",
      message: `A recruiter started a conversation about: ${job.title}`
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all chats for the current user
exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
      .populate("participants", "email role")
      .populate("jobId", "title")
      .sort({ lastMessageAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET messages for a specific chat
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Verify user is a participant
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to view this chat" });
    }

    const messages = await Message.find({ chatId })
      .populate("senderId", "email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SEND a message in a chat
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    // Verify user is a participant
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to send messages here" });
    }

    const message = await Message.create({
      chatId,
      senderId: req.user._id,
      text: text.trim()
    });

    // Update chat's last message
    chat.lastMessage = text.trim().substring(0, 100);
    chat.lastMessageAt = Date.now();
    await chat.save();

    // Notify the other participant
    const recipientId = chat.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );

    if (recipientId) {
      await Notification.create({
        userId: recipientId,
        type: "system",
        message: `New message: "${text.trim().substring(0, 50)}..."`
      });
    }

    const populated = await Message.findById(message._id)
      .populate("senderId", "email role");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

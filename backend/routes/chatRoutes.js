const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  startChat,
  getMyChats,
  getChatMessages,
  sendMessage
} = require("../controllers/chatController");

// Start or get existing chat (recruiter initiates)
router.post("/start/:jobId/:candidateId", authMiddleware, startChat);

// Get all chats for current user
router.get("/my-chats", authMiddleware, getMyChats);

// Get messages for a specific chat
router.get("/:chatId", authMiddleware, getChatMessages);

// Send message in a chat
router.post("/message/:chatId", authMiddleware, sendMessage);

module.exports = router;

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAsRead
} = require("../controllers/notificationController");

// Get all notifications for logged-in user
router.get("/", authMiddleware, getNotifications);

// Mark notification as read
router.put("/read/:id", authMiddleware, markAsRead);

module.exports = router;

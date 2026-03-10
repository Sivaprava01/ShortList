const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createJourney,
  getJourneyFeed,
  getJourneyById
} = require("../controllers/journeyController");

// Create a journey post
router.post("/", authMiddleware, createJourney);

// Get personalized feed
router.get("/feed", authMiddleware, getJourneyFeed);

// Get single journey
router.get("/:id", authMiddleware, getJourneyById);

module.exports = router;

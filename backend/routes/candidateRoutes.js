const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createOrUpdateProfile,
  getMyProfile,
  getProfileById
} = require("../controllers/candidateController");

// Create or Update Profile
router.post("/profile", authMiddleware, createOrUpdateProfile);

// Get My Profile
router.get("/profile/me", authMiddleware, getMyProfile);

// Public Profile
router.get("/profile/:id", getProfileById);

module.exports = router;

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createOrUpdateProfile,
  getMyProfile,
  getProfileById,
  getCandidateMatches
} = require("../controllers/candidateController");

// Create or Update Profile
router.post("/profile", authMiddleware, createOrUpdateProfile);

// Get My Profile
router.get("/profile/me", authMiddleware, getMyProfile);

// Get Candidate Matches
router.get("/matches", authMiddleware, getCandidateMatches);

// Public Profile
router.get("/profile/:id", getProfileById);

module.exports = router;

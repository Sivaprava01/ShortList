const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const recruiterMiddleware = require("../middleware/recruiterMiddleware");

const { runMatchingForJob, getMatchesForJob, getCandidateMatches } = require("../controllers/matchController");

// Run matching for a job (Recruiter only)
router.post(
  "/job/:jobId",
  authMiddleware,
  recruiterMiddleware,
  runMatchingForJob
);

// Get matches for a job (Recruiter View)
router.get(
  "/job/:jobId",
  authMiddleware,
  recruiterMiddleware,
  getMatchesForJob
);

// Get matches for current candidate
router.get(
  "/candidate",
  authMiddleware,
  getCandidateMatches
);

module.exports = router;

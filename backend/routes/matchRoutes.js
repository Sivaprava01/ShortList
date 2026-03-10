const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const recruiterMiddleware = require("../middleware/recruiterMiddleware");

const { runMatchingForJob, getMatchesForJob } = require("../controllers/matchController");

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

module.exports = router;

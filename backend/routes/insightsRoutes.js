const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const recruiterMiddleware = require("../middleware/recruiterMiddleware");
const { getRecruiterInsights } = require("../controllers/insightsController");

// Recruiter insights dashboard data
router.get("/recruiter", authMiddleware, recruiterMiddleware, getRecruiterInsights);

module.exports = router;

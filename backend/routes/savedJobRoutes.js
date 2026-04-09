const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { saveJob, unsaveJob, getSavedJobs } = require("../controllers/savedJobController");

// Get all saved jobs
router.get("/", authMiddleware, getSavedJobs);

// Save a job
router.post("/:jobId", authMiddleware, saveJob);

// Unsave a job
router.delete("/:jobId", authMiddleware, unsaveJob);

module.exports = router;

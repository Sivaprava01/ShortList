const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const recruiterMiddleware = require("../middleware/recruiterMiddleware");

const {
  createJob,
  getMyJobs,
  getJobById
} = require("../controllers/jobController");

// Create Job
router.post(
  "/",
  authMiddleware,
  recruiterMiddleware,
  createJob
);

// Get My Jobs
router.get(
  "/my-jobs",
  authMiddleware,
  recruiterMiddleware,
  getMyJobs
);

// Get Single Job
router.get("/:id", authMiddleware, getJobById);

module.exports = router;

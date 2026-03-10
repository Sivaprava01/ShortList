const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const recruiterMiddleware = require("../middleware/recruiterMiddleware");

const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus
} = require("../controllers/applicationController");

// Candidate: Apply to a job
router.post("/apply/:jobId", authMiddleware, applyToJob);

// Candidate: Get my applications
router.get("/my-applications", authMiddleware, getMyApplications);

// Recruiter: Get applications for a job
router.get("/job/:jobId", authMiddleware, recruiterMiddleware, getApplicationsForJob);

// Recruiter: Update application status
router.put("/:id/status", authMiddleware, recruiterMiddleware, updateApplicationStatus);

module.exports = router;

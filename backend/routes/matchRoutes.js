const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const recruiterMiddleware = require("../middleware/recruiterMiddleware");

const { runMatchingForJob } = require("../controllers/matchController");

router.post(
  "/job/:jobId",
  authMiddleware,
  recruiterMiddleware,
  runMatchingForJob
);

module.exports = router;

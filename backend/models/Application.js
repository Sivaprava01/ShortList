const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CandidateProfile",
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  matchScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["applied", "shortlisted", "rejected"],
    default: "applied"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate applications
applicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);

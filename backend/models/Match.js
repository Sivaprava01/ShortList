const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CandidateProfile",
    required: true
  },

  finalScore: {
    type: Number,
    required: true
  },

  breakdown: {
    skillScore: Number,
    experienceScore: Number,
    projectScore: Number
  },

  // Enhanced match details for transparency
  matchDetails: {
    mustHaveSkillsMatched: Number,
    totalMustHaveSkills: Number,
    goodToHaveSkillsMatched: Number,
    totalGoodToHaveSkills: Number,
    experienceYears: Number,
    projectCount: Number
  },

  status: {
    type: String,
    enum: ["notified", "viewed", "applied", "qualified", "rejected"],
    default: "notified"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
matchSchema.index({ jobId: 1, finalScore: -1 });
matchSchema.index({ candidateId: 1, finalScore: -1 });

module.exports = mongoose.model("Match", matchSchema);

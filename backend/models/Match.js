const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },

  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CandidateProfile"
  },

  finalScore: Number,

  breakdown: {
    skillScore: Number,
    experienceScore: Number,
    projectScore: Number
  },

  status: {
    type: String,
    enum: ["notified", "applied", "qualified", "rejected"],
    default: "notified"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Match", matchSchema);

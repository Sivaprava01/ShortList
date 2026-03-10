const mongoose = require("mongoose");

const journeySchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  story: {
    type: String,
    required: true
  },
  techStack: [String],
  yearsExperience: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

journeySchema.index({ createdAt: -1 });
journeySchema.index({ techStack: 1 });

module.exports = mongoose.model("Journey", journeySchema);

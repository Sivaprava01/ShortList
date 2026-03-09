const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: String,
  description: String,

  mustHaveSkills: [String],
  goodToHaveSkills: [String],

  minExperience: Number,
  maxExperience: Number,

  location: String,

  topNCandidates: {
    type: Number,
    default: 5
  },

  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Job", jobSchema);

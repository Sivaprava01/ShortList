const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  fullName: String,
  headline: String,

  roles: [String],

  skills: [
    {
      name: String,
      level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"]
      },
      years: Number
    }
  ],

  experienceYears: Number,

  education: {
    degree: String,
    institution: String,
    year: Number,
    GPA: Number
  },

  workInternships: [
    {
      role: String,
      company: String,
      duration: String,
      achievements: [String]
    }
  ],

  projects: [
    {
      title: String,
      description: String,
      techStack: [String],
      link: String
    }
  ],

  achievementsCertifications: [String],

  portfolioLinks: [String],

  bio: String,

  codingLinks: [String],

  resumeUrl: String,

  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema
);

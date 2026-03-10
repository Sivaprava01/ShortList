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
  bio: String,

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

  // Enhanced experience structure
  experience: [
    {
      company: String,
      role: String,
      years: Number,
      techStack: [String],
      description: String
    }
  ],

  // Keep experienceYears for backward compatibility and quick filtering
  experienceYears: Number,

  // Enhanced education - now supports multiple entries
  education: [
    {
      degree: String,
      institution: String,
      year: Number,
      GPA: Number
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

  portfolioLinks: [String],
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
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
candidateProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("CandidateProfile", candidateProfileSchema);

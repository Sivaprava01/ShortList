const CandidateProfile = require("../models/CandidateProfile");
const Job = require("../models/Job");
const Match = require("../models/Match");

const { rankCandidates } = require("../utils/matchingEngine");

exports.runMatchingForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Get all public candidate profiles
    const candidates = await CandidateProfile.find({
      visibility: "public"
    });

    // Use enhanced ranking system
    const rankedMatches = rankCandidates(candidates, job);

    // Clear existing matches for this job
    await Match.deleteMany({ jobId: job._id });

    // Save new matches to database
    const matchesToSave = rankedMatches.map(match => ({
      candidateId: match.candidateId,
      jobId: job._id,
      finalScore: match.finalScore,
      breakdown: match.scoreBreakdown,
      matchDetails: match.matchDetails
    }));

    const savedMatches = await Match.insertMany(matchesToSave);

    res.json({
      message: `Found ${rankedMatches.length} qualified candidates`,
      matches: savedMatches,
      jobTitle: job.title
    });

  } catch (error) {
    console.error('Matching error:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET MATCHES FOR A JOB (Recruiter View)
exports.getMatchesForJob = async (req, res) => {
  try {
    const matches = await Match.find({ jobId: req.params.jobId })
      .populate("candidateId")
      .sort({ finalScore: -1 });

    const result = matches.map(match => ({
      candidateId: match.candidateId._id,
      candidateProfile: match.candidateId,
      finalScore: match.finalScore,
      scoreBreakdown: match.breakdown,
      matchDetails: match.matchDetails,
      status: match.status
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MATCHES FOR A CANDIDATE (Candidate View)
exports.getCandidateMatches = async (req, res) => {
  try {
    const candidateProfile = await CandidateProfile.findOne({ 
      userId: req.user.id 
    });

    if (!candidateProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const matches = await Match.find({ 
      candidateId: candidateProfile._id 
    })
    .populate("jobId")
    .sort({ finalScore: -1 });

    const result = matches.map(match => ({
      jobId: match.jobId._id,
      jobTitle: match.jobId.title,
      jobDescription: match.jobId.description,
      location: match.jobId.location,
      matchScore: match.finalScore,
      scoreBreakdown: match.breakdown,
      status: match.status,
      createdAt: match.createdAt
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

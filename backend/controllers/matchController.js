const CandidateProfile = require("../models/CandidateProfile");
const Job = require("../models/Job");
const Match = require("../models/Match");

const { calculateMatchScore } = require("../utils/matchingEngine");

exports.runMatchingForJob = async (req, res) => {

  try {

    const job = await Job.findById(req.params.jobId);

    const candidates = await CandidateProfile.find({
      visibility: "public"
    });

    let matches = [];

    for (let candidate of candidates) {

      const result = calculateMatchScore(candidate, job);

      if (result) {
        matches.push({
          candidateId: candidate._id,
          jobId: job._id,
          finalScore: result.finalScore,
          breakdown: result.breakdown
        });
      }
    }

    // Sort by score DESC
    matches.sort((a, b) => b.finalScore - a.finalScore);

    // Top N Selection
    const topMatches = matches.slice(0, job.topNCandidates);

    // Save to DB
    await Match.deleteMany({ jobId: job._id });

    const savedMatches = await Match.insertMany(topMatches);

    res.json(savedMatches);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

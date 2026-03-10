const CandidateProfile = require("../models/CandidateProfile");
const Match = require("../models/Match");
const Job = require("../models/Job");

// CREATE / UPDATE PROFILE
exports.createOrUpdateProfile = async (req, res) => {
  try {

    const profileData = {
      ...req.body,
      userId: req.user._id
    };

    const profile = await CandidateProfile.findOneAndUpdate(
      { userId: req.user._id },
      profileData,
      { new: true, upsert: true }
    );

    res.json(profile);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY PROFILE
exports.getMyProfile = async (req, res) => {
  try {

    const profile = await CandidateProfile.findOne({
      userId: req.user._id
    });

    res.json(profile);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PROFILE BY ID (PUBLIC VIEW)
exports.getProfileById = async (req, res) => {
  try {

    const profile = await CandidateProfile.findById(req.params.id);

    res.json(profile);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CANDIDATE MATCHES (Jobs matched to this candidate)
exports.getCandidateMatches = async (req, res) => {
  try {

    const profile = await CandidateProfile.findOne({
      userId: req.user._id
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const matches = await Match.find({
      candidateId: profile._id
    }).populate("jobId").sort({ finalScore: -1 });

    const result = matches.map(match => ({
      jobTitle: match.jobId.title,
      location: match.jobId.location,
      matchScore: match.finalScore,
      jobDescription: match.jobId.description,
      jobId: match.jobId._id
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

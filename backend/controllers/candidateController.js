const CandidateProfile = require("../models/CandidateProfile");

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

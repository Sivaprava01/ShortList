const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

// SAVE A JOB
exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const saved = await SavedJob.create({ userId: req.user._id, jobId });
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Job already saved" });
    }
    res.status(500).json({ message: error.message });
  }
};

// UNSAVE A JOB
exports.unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    await SavedJob.findOneAndDelete({ userId: req.user._id, jobId });
    res.json({ message: "Job removed from saved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL SAVED JOBS FOR USER
exports.getSavedJobs = async (req, res) => {
  try {
    const saved = await SavedJob.find({ userId: req.user._id })
      .populate("jobId")
      .sort({ savedAt: -1 });

    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

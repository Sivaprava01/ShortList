const Job = require("../models/Job");

// CREATE JOB
exports.createJob = async (req, res) => {
  try {

    const job = await Job.create({
      ...req.body,
      recruiterId: req.user._id
    });

    res.status(201).json(job);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL JOBS BY RECRUITER
exports.getMyJobs = async (req, res) => {
  try {

    const jobs = await Job.find({
      recruiterId: req.user._id
    });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE JOB
exports.getJobById = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id);

    res.json(job);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

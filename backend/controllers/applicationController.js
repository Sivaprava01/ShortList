const Application = require("../models/Application");
const CandidateProfile = require("../models/CandidateProfile");
const Job = require("../models/Job");
const Match = require("../models/Match");
const Notification = require("../models/Notification");

// CANDIDATE: Apply to a job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find candidate profile
    const profile = await CandidateProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Please create your profile first" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      candidateId: profile._id,
      jobId
    });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    // Get match score if exists
    const match = await Match.findOne({
      candidateId: profile._id,
      jobId
    });

    // Create application
    const application = await Application.create({
      candidateId: profile._id,
      jobId,
      matchScore: match ? match.finalScore : 0,
      status: "applied"
    });

    // Notify recruiter
    const job = await Job.findById(jobId);
    if (job) {
      await Notification.create({
        userId: job.recruiterId,
        type: "application",
        message: `${profile.fullName || "A candidate"} applied to your job: ${job.title}`
      });
    }

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CANDIDATE: Get my applications
exports.getMyApplications = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.json([]);
    }

    const applications = await Application.find({
      candidateId: profile._id
    })
      .populate("jobId")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RECRUITER: Get all applications for a job
exports.getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify the job belongs to this recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    const applications = await Application.find({ jobId })
      .populate("candidateId")
      .sort({ matchScore: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RECRUITER: Update application status (shortlist / reject)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'shortlisted' or 'rejected'" });
    }

    const application = await Application.findById(id).populate("jobId");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify the job belongs to this recruiter
    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    // Find candidate's userId for notification
    const candidateProfile = await CandidateProfile.findById(application.candidateId);
    if (candidateProfile) {
      const notifType = status === "shortlisted" ? "shortlist" : "rejection";
      const notifMessage =
        status === "shortlisted"
          ? `Congratulations! You've been shortlisted for: ${application.jobId.title}`
          : `Your application for ${application.jobId.title} was not selected at this time.`;

      await Notification.create({
        userId: candidateProfile.userId,
        type: notifType,
        message: notifMessage
      });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

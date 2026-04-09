const Job = require("../models/Job");
const Match = require("../models/Match");
const Application = require("../models/Application");

// RECRUITER INSIGHTS — aggregated stats for all recruiter's jobs
exports.getRecruiterInsights = async (req, res) => {
  try {
    // Get all jobs belonging to this recruiter
    const jobs = await Job.find({ recruiterId: req.user._id });
    const jobIds = jobs.map(j => j._id);

    if (jobIds.length === 0) {
      return res.json({
        totalJobs: 0,
        openJobs: 0,
        totalApplicants: 0,
        avgMatchScore: 0,
        topSkills: [],
        jobStats: []
      });
    }

    // Total applications across all jobs
    const totalApplicants = await Application.countDocuments({ jobId: { $in: jobIds } });

    // Average match score across all matches for all jobs
    const matchAgg = await Match.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: null, avg: { $avg: "$finalScore" }, count: { $sum: 1 } } }
    ]);
    const avgMatchScore = matchAgg[0]?.avg ? Math.round(matchAgg[0].avg) : 0;

    // Per-job stats: applicant count + top match score
    const jobStats = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ jobId: job._id });
        const topMatch = await Match.findOne({ jobId: job._id }).sort({ finalScore: -1 });
        return {
          jobId: job._id,
          title: job.title,
          status: job.status,
          applicantCount,
          topMatchScore: topMatch?.finalScore || 0
        };
      })
    );

    // Skill distribution — find most common skills across matched candidates
    const matches = await Match.find({ jobId: { $in: jobIds } }).populate("candidateId");
    const skillCount = {};
    matches.forEach(m => {
      (m.candidateId?.skills || []).forEach(s => {
        if (s.name) skillCount[s.name] = (skillCount[s.name] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    res.json({
      totalJobs: jobs.length,
      openJobs: jobs.filter(j => j.status === 'open').length,
      totalApplicants,
      avgMatchScore,
      topSkills,
      jobStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

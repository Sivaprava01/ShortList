const Journey = require("../models/Journey");
const CandidateProfile = require("../models/CandidateProfile");

// CREATE a journey post
exports.createJourney = async (req, res) => {
  try {
    const { title, story, techStack, yearsExperience } = req.body;

    if (!title || !story || !yearsExperience) {
      return res.status(400).json({ message: "Title, story, and years of experience are required" });
    }

    const journey = await Journey.create({
      authorId: req.user._id,
      title,
      story,
      techStack: techStack || [],
      yearsExperience
    });

    res.status(201).json(journey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET personalized feed — posts where skills overlap AND author has more experience
exports.getJourneyFeed = async (req, res) => {
  try {
    // Get current user's candidate profile for personalization
    const profile = await CandidateProfile.findOne({ userId: req.user._id });

    let journeys;

    if (profile && profile.skills && profile.skills.length > 0) {
      const userSkillNames = profile.skills.map(s => s.name.toLowerCase());
      const userExperience = profile.experienceYears || 0;

      // Fetch all journeys from authors with more experience
      const allJourneys = await Journey.find({
        yearsExperience: { $gt: userExperience }
      })
        .populate("authorId", "email role")
        .sort({ createdAt: -1 })
        .limit(50);

      // Filter by tech stack overlap (done in-app since MongoDB text matching is limited for arrays)
      journeys = allJourneys.filter(j => {
        if (!j.techStack || j.techStack.length === 0) return true; // Show posts without specific tech
        return j.techStack.some(tech =>
          userSkillNames.some(skill =>
            skill.includes(tech.toLowerCase()) || tech.toLowerCase().includes(skill)
          )
        );
      });
    } else {
      // No profile or no skills — return all journeys sorted by recency
      journeys = await Journey.find()
        .populate("authorId", "email role")
        .sort({ createdAt: -1 })
        .limit(20);
    }

    res.json(journeys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single journey by ID
exports.getJourneyById = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id)
      .populate("authorId", "email role");

    if (!journey) {
      return res.status(404).json({ message: "Journey not found" });
    }

    res.json(journey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

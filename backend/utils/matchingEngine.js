// HARD FILTERS + SOFT SCORING

exports.calculateMatchScore = (candidate, job) => {

  // HARD FILTERS
  if (candidate.visibility === "private") return null;

  if (candidate.experienceYears < job.minExperience) return null;

  // Must Have Skills Check
  const candidateSkillNames = candidate.skills.map(s => s.name.toLowerCase());

  for (let skill of job.mustHaveSkills) {
    if (!candidateSkillNames.includes(skill.toLowerCase())) {
      return null;
    }
  }

  // SOFT SCORING

  // Skill Score (50%)
  let skillMatchCount = 0;

  job.mustHaveSkills.forEach(skill => {
    if (candidateSkillNames.includes(skill.toLowerCase())) {
      skillMatchCount++;
    }
  });

  const skillScore = (skillMatchCount / job.mustHaveSkills.length) * 50;

  // Experience Score (30%)
  let expScore = 0;

  if (candidate.experienceYears >= job.minExperience) {
    expScore = 30;
  }

  // Project Score (20%)
  let projectScore = Math.min(candidate.projects.length * 5, 20);

  const finalScore = skillScore + expScore + projectScore;

  return {
    finalScore,
    breakdown: {
      skillScore,
      experienceScore: expScore,
      projectScore
    }
  };
};
